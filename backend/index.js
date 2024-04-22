const express = require('express');
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser');
const {MongoClient} = require('mongodb');

app.use(express.urlencoded());
app.use(bodyParser.json());
app.use(cors())


let [db,client,collection,collection1] = '';
async function connectToDatabase() {
    try {
        client = await MongoClient.connect('mongodb+srv://Monish:mmonish875@cluster0.7pfxpj7.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });
        db = client.db('Kanban');
        console.log('Connected to the database');
    } catch (error) {
        console.error('Error connecting to the database', error);
    }
}

connectToDatabase().then(async() => {
    collection = db.collection('emails');
    collection1 = db.collection('groups');
    const date = new Date();
    
    app.post("/email",async(req,res)=>{
        let email = `${req.body.email}`.split('@')[0];
        let dates = req.body.dates;
        let data = await collection.findOne({[email]:{ $exists : true }});

        if (data==null) {
            let acknowledgement = await collection.insertOne(
            {
                [email]:
                {
                    'workspaces':['Workspace 1'],
                    'cards':
                    {
                    'cards_name':[0,'Card 1'],
                    'cards_desc':[0,'Card Description'],
                    'cards_title':[0,'Card Title'],
                    },
                    'tasks':[0,1,'Sip a Coffee'],
                    'date':[dates,dates,dates],
                    'current':'Workspace 1',
                    'groups' : []
                }
            })
            res.json({acknowledgement : acknowledgement.insertedId})
        }
        else{
            let groups = data[`${email}`]['groups'];
            let gdata = [];
            try {
                for (let index = 0; index < groups.length; index++) {
                    const grp = groups[index];
                    let tempdata = await collection1.findOne({ [grp]: { $exists: true } });
                    gdata.push(tempdata[grp]);
                }
                gdata = await gdata;
            } catch (error) {
                
            }    
            res.json({individual:data[`${email}`],group:gdata})
        }
    })

    app.post("/groupmail",async(req,res)=>{
        let [email,name,groupcode,workspacename] = [`${req.body.email}`.split("@")[0],req.body.name,req.body.groupcode,req.body.workspacename];
        let [dates,estring] = [req.body.dates,`${email}.groups`];
        let data = await collection1.findOne({[groupcode]:{ $exists : true }});
        if (data==null) {
            let acknowledgement = await collection1.insertOne(
            {
                [groupcode]:
                {
                    'workspaces':[workspacename],
                    'cards':
                    {
                    'cards_name':[0,'Card 1'],
                    'cards_desc':[0,'Card Description'],
                    'cards_title':[0,'Card Title'],
                    },
                    'tasks':[0,1,'Sip a Coffee'],
                    'date':[dates,dates,dates],
                    'current':'Workspace 1',
                    'users':[name]
                }
            })
            collection.updateOne(
                { [email]: { $exists: true } }, 
                { $push: { [estring]: groupcode } }
            )     
            res.json({acknowledgement : acknowledgement.insertedId})
        }
        else{
            res.json(data[`${name}`])
        }
    })

    app.post("/handlegroup",async(req,res)=>{
        let [email,name,code,partition]=[`${req.body.email}`.split("@")[0],req.body.name,req.body.code,parseInt(req.body.partition)]
        let search = await collection1.findOne({[code]:{ $exists : true }})
        if (partition === 0) {
            res.json(search)
        }
        else{
            let [gstring,istring]=[`${code}.users`,`${email}.groups`];
            collection1.updateOne({[code]: { $exists: true }},{ $push: { [gstring]: name } });
            collection.updateOne({[email]: { $exists: true } },{ $push:{[istring]: code }}) 
            res.json(search)
        }
    })

    app.post("/workspace",async(req,res)=>{
        let [email,workspace,check] = [`${req.body.email}`.split('@')[0],req.body.workspacename,req.body.check];
        let data = email + ".workspaces";
        let data1 = email + ".cards.";
        let data2 = email + ".tasks";
        let dates = email + ".date";
        
        const datess = [date.getDate(),date.getMonth()+1,date.getFullYear(),date.getHours(),date.getMinutes()];
        let [cname,ctitle,cdesc]=[data1+"cards_name",data1+"cards_title",data1+"cards_desc"]

        if (check==0) {
            await collection.updateOne(
                {[email]:{ $exists : true }},  
                { $push:{ 
                    [data]: workspace,
                    [cname]: 0,
                    [ctitle]: 0,
                    [cdesc]: 0,
                    [data2]: 0,
                    [dates] : datess
                }  
            });
        }
        else if(check==1){
            let alldata = await collection.findOne(
                {[email]:{ $exists : true }}
            );


            let [cards_name,cards_desc,cards_title,tasks,cdates,name]=[alldata[`${email}`]['cards']['cards_name'],alldata[`${email}`]['cards']['cards_desc'],alldata[`${email}`]['cards']['cards_title'],alldata[`${email}`]['tasks'],alldata[`${email}`]['date'],req.body.name]
            let cardsdata = []
            let index = null;
            let count=-1;

            alldata[email]['workspaces'].forEach((nworkspace,index1) => {
                if (nworkspace==workspace) {
                    index=index1
                }
            });

            
            if (index === null) {
                for (let index = 0; index < alldata[email]['groups'].length; index++) {
                    const gworksp = await collection1.findOne({[alldata[email]['groups'][index]]: {$exists : true}});
                    if (gworksp[alldata[email]['groups'][index]]['workspaces'][0] === workspace) {
                        for (let index1 = 0; index1 < gworksp[alldata[email]['groups'][index]]['users'].length; index1++) {
                                const groupusers = gworksp[alldata[email]['groups'][index]]['users'][index1];
                                if (groupusers === name) {
                                    gworksp[alldata[email]['groups'][index]]['users'].splice(index1,1);
                                }
                            }
                        
                        if (gworksp[alldata[email]['groups'][index]]['users'][0] === undefined) {
                            const id = gworksp._id
                            collection1.deleteOne({_id : id});
                        }
                        else{
                            collection1.updateOne(
                                {[alldata[email]['groups'][index]]: {$exists : true}},  
                                { $set: {
                                    [`${alldata[email]['groups'][index]}.users`]: gworksp[alldata[email]['groups'][index]]['users'], 
                                },
                            }  
                            );
                        }
                        alldata[email]['groups'].splice(index,1);
                        break;
                    }
                }
                await collection.updateOne(
                    {[email]:{ $exists : true }},  
                    { $set: {
                        [`${email}.groups`]: alldata[email]['groups'], 
                    },
                }  
                );
            }
            else{
                cards_name.forEach((element,index1) => {
                    if (element==0) {
                        count++;
                        if (count==index || count-1==index) {
                            cardsdata.push(index1)
                        }
                    }
                });
    
                count=cardsdata[1]?cardsdata[1]:cards_name.length
                cards_name.splice(cardsdata[0],count-cardsdata[0]);
                cards_title.splice(cardsdata[0],count-cardsdata[0]);
                cards_desc.splice(cardsdata[0],count-cardsdata[0]);
                
                count=-1;
                cardsdata=[];
                tasks.forEach((task,index1) => {
                    if (task==0) {
                        count++;
                        if (count==index || count-1==index) {
                            cardsdata.push(index1);
                        }
                    }    
                });
                
                count=cardsdata[1]?cardsdata[1]:tasks.length
                tasks.splice(cardsdata[0],count-cardsdata[0])
                cdates.splice(cardsdata[0],count-cardsdata[0]);
    
                await collection.updateOne(
                    {[email]:{ $exists : true }},  
                    { $set: {
                        [cname]: cards_name,
                        [ctitle]: cards_title,
                        [cdesc]: cards_desc,
                        [dates]: cdates 
                    },
                }  
                );
    
                await collection.updateOne(
                    {[email]:{ $exists : true }},  
                    { $pull: {
                        [data]: workspace,
                    },
                }  
                );
    
                await collection.updateOne(
                    {[email]:{ $exists : true }},  
                    { $set: {
                        [data2]: tasks,
                    },
                }  
                );
            }
        }
        else if(check==2){
            let workspace_newname = req.body.workspace_new;
            await collection.updateOne(
                { [data]: workspace },
                { "$set": { [data+".$"]: workspace_newname } }
            );
        }
        res.sendStatus(200)
    });

    app.post("/card",async(req,res)=>{
        let [email,card_name,check,active_workspace,dates] = [`${req.body.email}`.split('@')[0],req.body.cardname,req.body.check,req.body.active_workspace,req.body.dates];
        let data = `${email}.cards.`
        let [cname,ctitle,cdesc,data2,cdate]=[data+"cards_name",data+"cards_title",data+"cards_desc",email+".tasks",`${email}.date`]

        if (check==0) {
            let [card_title,card_desc,pos,choose]= [req.body.cardtitle,req.body.carddesc,req.body.position,[0]]
            let datas = await collection.findOne({[email]:{ $exists : true }});
            datas = datas[email];

            let verify = datas['workspaces']
            for (let index = 0; index < verify.length; index++) {
                const element = verify[index];
                if (element != active_workspace) {
                    choose[0] = 1;
                }
                else{
                    choose[0] = 0;
                    break;
                }
            }

            if (choose[0] === 1) {
                let datagroups = datas['groups'];
                for (let index = 0; index < datagroups.length; index++) {
                    const element = datagroups[index];
                    let waitforit = await collection1.findOne({[element]:{$exists : true}})
                    if (waitforit[element]['workspaces'][0] === active_workspace) {
                        datas = waitforit[element]
                        datagroups.push(element)
                        break;
                    }   
                }
                let tasks = datas['tasks'];
                tasks.push(1)
                tasks.push('Task 1')
                let venom = datas['cards']['cards_name'].length-1
                datas['cards']['cards_name'].push(`Card ${parseInt(datas['cards']['cards_name'][venom].split(' ')[1])+1}`)
                datas['cards']['cards_desc'].push(`Card Description`)
                datas['cards']['cards_title'].push(`Card Title`)
                datas['date'].push(dates)
                datas['date'].push(dates)

                await collection1.updateOne(
                    { [`${datagroups[datagroups.length-1]}`]: { $exists: true } },
                    {
                      $set: {
                        [`${datagroups[datagroups.length-1]}.cards.cards_name`]: datas['cards']['cards_name'],
                        [`${datagroups[datagroups.length-1]}.cards.cards_title`]: datas['cards']['cards_title'],
                        [`${datagroups[datagroups.length-1]}.cards.cards_desc`]: datas['cards']['cards_desc'],
                        [`${datagroups[datagroups.length-1]}.tasks`]: tasks,
                        [`${datagroups[datagroups.length-1]}.date`]: dates
                      }
                    }
                );

                res.json(venom);
            }
            else{
                let tasks = datas['tasks'];
                let [count,venom]=[-1,0];
    
                datas['workspaces'].forEach((workspace,index) => {
                    if (workspace==active_workspace) {
                        active_workspace=index
                    }
                });
    
                for (let index = 0; index < tasks.length; index++) {
                    const element = tasks[index];
                    if (element === 0) {
                        count++;
                    }
                    if (active_workspace === count) {
                        if (typeof element == 'string') {
                            venom++;
                        }
                    }
                }
    
                count = 0;
    
                for (let index = 0; index < datas['cards']['cards_name'].length; index++) {
                    if (datas['cards']['cards_name'][index]==0) {
                        if (count==active_workspace+1) {
                            pos=index;
                            break;
                        }
                        else{
                            count++;
                        }
                    }
                    if (datas['cards']['cards_name'].length-1 == index){
                        pos = datas['cards']['cards_name'].length;
                    }
                }
                check=0;
                count=0;
                
                for (let index = 0; index < datas['tasks'].length; index++) {
                    if (datas['tasks'][index]==0) {
                        if (active_workspace+1 == check) {
                            count=index;
                            break;
                        }
                        check++;
                    }
                    if (datas['tasks'].length-1 == index){
                        count = datas['tasks'].length;
                    }
                }
    
                await collection.updateMany(
                    { [email]: { $exists: true } },
                    {
                    $push: {
                        [cname]: {
                        $each: [card_name],
                        $position: pos
                        },
                        [ctitle]: {
                        $each: [card_title],
                        $position: pos
                        },
                        [cdesc]: {
                        $each: [card_desc],
                        $position: pos,
                        },
                        [data2]: {
                            $each: [0o1,"Task 1"],
                            $position:count,
                        },
                        [cdate] : {
                            $each : [dates,dates],
                            $position : count
                        }  
                    }
                }
            );
            res.json(venom);
            }
            
        }
        else if(check==1){
            let datas = await collection.findOne({[email]:{ $exists : true }});
            datas = datas[email];
            let [count,position,index1,cards_name,cards_title,cards_desc,tasks,cdates]=[0,[],-1,datas['cards']['cards_name'],datas['cards']['cards_title'],datas['cards']['cards_desc'],datas['tasks'],datas['date']];

            datas['workspaces'].forEach((workspace,index) => {
                if (workspace==active_workspace) {
                    active_workspace=index
                }
            });

            cards_name.forEach((element,index) => {
                if (element==0) {
                    index1++;
                }
                if (index1==active_workspace && element!=0) {
                    position.push(element)   
                }
                if (element == card_name) {
                    count=index;
                }
            });
            index1 = -1;
            
            cards_name.splice(count,1);
            cards_title.splice(count,1);
            cards_desc.splice(count,1);
            
            position.forEach((element,index) => {
                if (element == card_name) {
                    count = index;         
                }
            });
            
            position = [count];
            count=-1;
            tasks.forEach((task,index) => {
                if (task == 0) {
                    index1++;
                    if (index1 == active_workspace+1) {
                        if (position[2]==undefined) {
                            position.push(index);
                        }
                    }
                }
                if (index1 == active_workspace) {
                    if (task == 1) {
                        count++;
                        if (count == position[0] || count == position[0]+1) {
                            position.push(index)
                        }
                    }
                }
            });
            
            position.splice(0,1);
            count = position[1]?position[1]:tasks.length;
            tasks.splice(position[0],count-position[0])
            cdates.splice(position[0],count-position[0]);
            
            await collection.updateOne(
                { [email]: { $exists: true } },
                {
                  $set: {
                    [cname]: cards_name,
                    [ctitle]: cards_title,
                    [cdesc]: cards_desc,
                    [data2]: tasks,
                    [cdate]:cdates
                  }
                }
              );
              res.sendStatus(200);
        }
        else{
            let [change,locate] = [req.body.change,req.body.locate];
            let data = await collection.findOne({[email]:{ $exists : true }});
            data = data[email];
            let [cards_name,cards_title,cards_desc]=[data['cards']['cards_name'],data['cards']['cards_title'],data['cards']['cards_desc']];

            cards_name.forEach(async(element,index) => {
                if (element == card_name) {
                    if (locate==1) {
                        cards_title[index]=change;
                        await collection.updateOne(
                            { [email]: { $exists: true } },
                            {
                              $set: {
                                [ctitle]: cards_title,
                              }
                            }
                        );
                    }
                    else{
                        cards_desc[index]=change;
                        await collection.updateOne(
                            { [email]: { $exists: true } },
                            {
                              $set: {
                                [cdesc]: cards_desc,
                              }
                            }
                        );
                    }
                }
            });
            res.sendStatus(200);
        }
        
    })

    app.post("/task",async(req,res)=>{
        const[email,task,card_name,check]=[`${req.body.email}`.split('@')[0],req.body.task,req.body.card_name,req.body.check];
        let taskstring = `${email}.tasks`
        let data = await collection.findOne({[email]:{ $exists : true }});
        let dates = [date.getDate(),date.getMonth()+1,date.getFullYear(),date.getHours(),date.getMinutes()];
        data = data[email];

        if (check==0) {
            let [cards_names,workspaces,active_workspace,alltasks,count,indo,boolean]= [data['cards']['cards_name'],data['workspaces'],0,data['tasks'],-1,null,false];
            let [workspace,tasklength,lcount] = [req.body.workspace,parseInt(task.split(" ")[1]),-1];
            let arraybox=[[],[],-1,0,0];
            
            workspaces.forEach((work,index) => {
                if (work == workspace) {
                    active_workspace = index
                }
            });
            
            cards_names.forEach((cardname) => {
                if (cardname === 0) {
                    arraybox[2]++;
                }

                if (arraybox[2] === active_workspace && cardname!=0) {
                    arraybox[1].push(cardname);
                }
            });
            arraybox[2] = -1;
            
            for (let index = 0; index < arraybox[1].length; index++) {
                const element = arraybox[1][index];
                if (element === card_name) {
                    arraybox[4]=index;      
                    break; 
                }
            }

            arraybox[1] = []

            cards_names.forEach((cardname,index) => {
                if (cardname === 0) {
                    cards_names.splice(index,1);
                }
            });
            
            cards_names.forEach((cardname,index)=>{
                if (cardname==card_name) {
                    indo=index
                }
            })

            for (let index = 0; index < alltasks.length; index++) {
                if (alltasks[index] === 0) {
                    arraybox[2]++;
                }

                if (arraybox[2] === active_workspace && alltasks[index] != 0) {
                    arraybox[0].push(alltasks[index]);
                }
            }
            arraybox[0].push(0);
            arraybox[2] = -1;

            for (let index = 0; index < arraybox[0].length; index++) {
                const element = arraybox[0][index];
                if (element === 1 || element === 0) {
                    arraybox[2]++;
                }

                if (arraybox[2] === arraybox[4]+1) {
                    arraybox[3] = index;
                    arraybox[2] = 0;
                    break;
                }
            }

            arraybox[4]+=1;
            arraybox[3] -= arraybox[4];

            for (let index = 0; index < alltasks.length; index++) {
                const tasky = alltasks[index];
                if (tasky==0) {
                    count++;
                }
                else if (count==active_workspace) {
                    if (tasky==1) {
                        lcount++;
                        if (lcount==indo) {
                            break
                        }
                    }
                }   
            }
            
            count= -1;
            for (let index = 0; index < alltasks.length; index++) {
                if (alltasks[index]==1) {
                    count++
                }
                if (count==indo) {
                    boolean=true;
                    indo=index;
                    break;
                }
            }
            indo+=tasklength;

            indo=boolean?indo:alltasks.length
            await collection.updateOne({[email]:{ $exists : true }},{$push:{[`${taskstring}`]:{$each:[task],$position:indo},[`${email}.date`]:{$each:[dates],$position:indo}}}) 
            res.json(arraybox[3])
        }
        else if(check==1){
            let [count,active_workspace,position,index1,cards_name,tasks]=[-1,req.body.workspace,[],-1,data['cards']['cards_name'],data['tasks']];

            data['workspaces'].forEach((workspace,index) => {
                if (workspace==active_workspace) {
                    active_workspace=index
                }
            });

            cards_name.forEach(element => {
                if (element==0) {
                    index1++;
                }
                if (index1==active_workspace && element!=0) {
                    position.push(element)   
                }
            });
            position.forEach((element,index) => {
                if (element == card_name) {
                    position.splice(0,position.length)
                    position.push(index)
                }
            });
            index1 = -1;
            let splitx=[]

            for (let index = 0; index < tasks.length; index++) {
                if (tasks[index] == 0) {
                    index1++;
                }
                if (index1 == active_workspace) {
                    if (tasks[index] == 1) {
                        count++;
                    }
                    if (count == position[0]) {
                        if (tasks[index] == task) {
                            tasks.splice(index,1);
                            data['date'].splice(index,1);
                            break;
                        }
                    }
                }
            }

            index1=-1;
            count=-1;
            tasks.forEach(element => {
                if (element == 0) {
                    index1++;
                }
                if (index1 == active_workspace) {
                    if (element == 1) {
                        count++;
                    }
                    else if (count == position[0]) {
                        splitx.push(element);
                    }
                }
            });
            
            await collection.updateOne(
                { [email]: { $exists: true } },
                {
                  $set: {
                    [taskstring]: tasks,
                    [`${email}.date`]: data['date']
                  }
                }
              );
            res.json(splitx)
        }
        else{
            let newvalue = req.body.newvalue;
            let [count,active_workspace,position,index1,cards_name,tasks]=[-1,req.body.workspace,[],-1,data['cards']['cards_name'],data['tasks']];

            data['workspaces'].forEach((workspace,index) => {
                if (workspace==active_workspace) {
                    active_workspace=index
                }
            });

            cards_name.forEach(element => {
                if (element==0) {
                    index1++;
                }
                if (index1==active_workspace && element!=0) {
                    position.push(element)   
                }
            });
            
            position.forEach((element,index) => {
                if (element == card_name) {
                    position.splice(0,position.length)
                    position.push(index)
                }
            });

            index1 = -1;
            tasks.forEach((element,index) => {
                if (element == 0) {
                    index1++;
                }
                if (index1 == active_workspace) {
                    if (element == 1) {
                        count++;
                    }
                    if (count == position[0]) {
                        if (element == task) {
                            tasks[index]=newvalue;
                        }
                    }
                }
            });

            await collection.updateOne(
                { [email]: { $exists: true } },
                {
                  $set: {
                    [taskstring]: tasks
                  }
                }
            );
            res.sendStatus(200)
        }
    })

    app.post("/readdata",async(req,res)=>{
        let email = `${req.body.email}`.split('@')[0];
        let data = await collection.findOne({[email]:{ $exists : true }});
        res.json(data[`${email}`][`cards`])
    })

    app.post("/readworkspace",async(req,res)=>{
        let [email,name,workspace] = [`${req.body.email}`.split('@')[0],req.body.name,req.body.workspace];
        let data = await collection.findOne({[email]:{ $exists : true }});
        collection.updateOne(
            { [email]: { $exists: true } }, 
            { $set: { [`${email}.current`]: workspace } }
        )         
        let [cards_name,cards_desc,cards_title,tasks]=[data[`${email}`]['cards']['cards_name'],data[`${email}`]['cards']['cards_desc'],data[`${email}`]['cards']['cards_title'],data[`${email}`]['tasks']];
        let [index,count,alldata,newdata,newtask,array]=[null,-1,[cards_name,cards_title,cards_desc],[],[],[]];
        let groups = data[`${email}`]['groups'];
        let gdata = [];
        try {
            for (let index = 0; index < groups.length; index++) {
                const grp = groups[index];
                let tempdata = await collection1.findOne({ [grp]: { $exists: true } });
                gdata.push(tempdata[grp]);
            }
            gdata = await gdata;
        } catch (error) {
            
        }    
        
        
        data[`${email}`]['workspaces'].forEach((worksp,num) => {
            if (worksp==workspace) {
                index=num; 
            }
        });

        if (index == null && gdata != []) {
            let groupintegrated_data = [[],[],[],[],[]]
            let cardstring = ['cards_name','cards_title','cards_desc']
            let grouptasks = [];
            for (let index = 0; index < gdata.length; index++) {
                const data = gdata[index];
                
                if (data.workspaces[0] == workspace) {
                    cardstring.forEach((cstring,index) => {
                        data.cards[cstring].forEach(element => {
                            if (element!=0) {
                                groupintegrated_data[index].push(element)                
                            }
                        });
                    });
                    data.tasks.forEach(tasks => {
                        if (tasks!=0) {
                            if (tasks!=1) {
                                array.push(tasks);
                            }
                            else{
                                grouptasks.push(array);
                                array=[]
                            }
                        }
                    });
                }
            }
            if (array.length!=null) {
                grouptasks.push(array)
            }
            grouptasks.splice(0,1)
            for (let index = 0; index < 3; index++) {
                groupintegrated_data[index].forEach(element => {
                    groupintegrated_data[4].push(element)
                });
            }
            grouptasks.forEach(gtask => {
                groupintegrated_data[4].push(gtask)
            });
            res.json({arrays:groupintegrated_data[4],section:1})
        }
        else{
            alldata.forEach(elem => {
                elem.forEach(element => {
                    if (count==index) {
                        if (element!=0) {
                            newdata.push(element)
                        }
                    }
                    if (element==0) {
                        count++;
                    }
                });
                count=-1;
            });
            
            tasks.forEach(task => {
                if (count==index) {
                    if (task!=0) {
                        if (task!=1) {
                            array.push(task);
                        }
                        else{
                            newtask.push(array);
                            array=[]
                        }
                    }
                }
                if (task==0) {
                    count++;
                }
            });
            if (tasks[tasks.length-1]!=0 || tasks[tasks.length-1]!=1) {
                newtask.splice(0,1);
                newtask.push(array);
                array=[]
            }
            let concatenatedArray=newtask[0][0]!=undefined?newdata.concat(newtask):newdata;
            res.json({arrays:concatenatedArray,section:1})
        }
    })

    function checker(save, mlength) {
        let temp = Math.ceil(Math.random() * (mlength - 1));
        for (let index = 0; index < save.length; index++) {
            const element = save[index];
            if (element == temp) {
                return checker(save, mlength);
            }
        }
        return temp;
    }
    

    app.post("/chatbotloader",async(req,res)=>{
        const jsondata = require('./tasks.json')
        let [email,number,action,plan]= [(req.body.email).split("@")[0],parseInt(req.body.num)?parseInt(req.body.num):5,parseInt(req.body.action),parseInt(req.body.plan)]
        if (action == 0) {
            let [statement,select,save] = [plan==0?jsondata.self:jsondata.business,``,[]]
            for (let index = 0; index < number; index++) {
                save.push(checker(save,statement.length));
                select += `${index+1}: ${statement[save[index]]}\n`
            }
            await collection.updateOne({ [email]: { $exists: true } },{ $set: { [`${email}.store`]: select } })
            res.json({email:`${email}`,statement:`${select}`})
        }
        else{
            let [statement] = [(await collection.findOne({[`${email}.store`]: { $exists: true }}))];
            statement = (statement[`${email}`].store).split("\n");
            let dates = [date.getDate(),date.getMonth()+1,date.getFullYear(),date.getHours(),date.getMinutes()];

            statement.splice(statement.length-1,1)
            let data = `${email}.cards.`
            let [cname,ctitle,cdesc,data2,cdate]=[data+"cards_name",data+"cards_title",data+"cards_desc",email+".tasks",`${email}.date`]

            let [datas,index,count,venom,check,array1,temp1] = [await collection.findOne({[email]:{ $exists : true }}),0,0,0,0,[],0];
            datas = datas[email];

            let card_name = datas['cards']['cards_name'];

            card_name.forEach(cardn => {
                if (typeof cardn === 'string') {
                    array1.push(parseInt(cardn.split(' ')[1]))
                }
            });
            array1.sort()

            for (let index = 0; index < array1.length; index++) {
                const element = array1[index];
                if (index >= 1) {
                    if(element - array1[index-1] != 1 && element - array1[index-1] != 0){
                        temp1 = `Card ${element-1}`;
                        break;
                    }
                }   
            }

            datas['workspaces'].forEach((worksp,num) => {
                if (worksp==datas.current) {
                    index=num+1; 
                }
            });
            
            
            for (let iindex = 0; iindex < datas['cards']['cards_name'].length; iindex++) {
                const element = datas['cards']['cards_name'][iindex];
                if (element === 0) {
                    count++;
                }
                if (index >= count) {
                    venom++;
                }
            }
            
            check=0;
            count=0;
            
            for (let iindex = 0; iindex < datas['tasks'].length; iindex++) {
                const element = datas['tasks'][iindex];
                if (element === 0) {
                    count++;
                }
                if (index >= count) {
                    check++;
                }
            }

            let tasks = datas['tasks']
            statement.forEach(async(state,index) => {
                state = state.split(`${index+1}: `)[1]
                if (index == 0) {
                    tasks.splice(check, 0, 1);    
                }
                tasks.splice(check+index+1, 0, state);
            });

            await collection.updateMany({ [email]: { $exists: true } },{ $set: { [data2]: tasks } });
            await collection.updateMany({ [email]: { $exists: true } },{ $unset: { [`${email}.store`]: "" } });
            await collection.updateMany(
                { [email]: { $exists: true } },
                {
                  $push: {
                    [cname]: {
                      $each: [temp1],
                      $position: venom
                    },
                    [ctitle]: {
                      $each: ['AI Generated'],
                      $position: venom
                    },
                    [cdesc]: {
                      $each: ['Your Schedule'],
                      $position: venom,
                    },
                    [cdate] : {
                        $each : [dates],
                        $position : venom
                    }  
                  }
                }
            );
    
            res.send(statement)
        }
    })

    function timediff(old,news,predict) {
        const date1 = new Date(old[0],old[1],old[2],old[3],old[4]);
        const date2 = new Date(news[0],news[1],news[2],news[3],news[4]);
        const difference = date2 - date1;
        let millisecondsPerDay = 1000 * 60 * 60 * 24;
        let daysDifference = Math.floor(difference / millisecondsPerDay);
        let hoursDifference = Math.floor((difference % millisecondsPerDay) / (1000 * 60 * 60));
        let minutesDifference = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        let aggregation = [daysDifference,hoursDifference,minutesDifference]
        for (let index = 0; index < aggregation.length; index++) {
            if (aggregation[index]<0) {
                aggregation[index]=aggregation[index]*(-2)-aggregation[index]
            }
        }
        if (predict === 0) {
            return daysDifference;
        }

        return `You have spent ${daysDifference} Days, ${hoursDifference} Hours and ${minutesDifference} Minutes `
    }

    app.post('/visualize', async(req, res) => {
        let [email,check]=[(req.body.email).split("@")[0],parseInt(req.body.check)];
        let [dates,data] = [[date.getFullYear(),date.getMonth(),date.getDate(),date.getHours(),date.getMinutes()],await collection.findOne({ [email]: { $exists: true } })];
        data = data[email]
        let [store,store1,labelnames] = [[],[],[]];
        switch (check) {
            case 0:
                data.tasks.forEach((task,index) => {
                    if (task === 0) {
                       labelnames = data.workspaces;
                       store.push([data.date[index][2],data.date[index][1],data.date[index][0],data.date[index][3],data.date[index][4]]);
                    }
                });
                break;

            case 1:
                data.cards.cards_title.forEach(ctitle => {
                    if (ctitle != 0) {
                        labelnames.push(ctitle);
                    }
                });
                data.tasks.forEach((task,index) => {
                    if (task === 1) {
                        try {
                            store.push([data.date[index][2],data.date[index][1],data.date[index][0],data.date[index][3],data.date[index][4]]);   
                        } catch (error) {
                            
                        }
                    }
                });
                break;

            case 2:
                data.tasks.forEach((task,index) => {
                    if (task != 0 && task != 1) {
                        try {
                            labelnames.push(task);
                            store.push([data.date[index][2],data.date[index][1],data.date[index][0],data.date[index][3],data.date[index][4]]);
                        } catch (error) {
                            
                        }
                    }
                });
                break;

            case 3:
                // let [worksp,cardsp]=[data.workspaces,[]]
                // data.cards.cards_title.forEach(ctitle => {
                //     if (ctitle != 0) {
                //         cardsp.push(ctitle);
                //     }
                // });
                // data.tasks.forEach((task,index) => {
                //     try {
                        
                //         store.push([data.date[index][2],data.date[index][1],data.date[index][0],data.date[index][3],data.date[index][4]]);
                //     } catch (error) {
                        
                //     }
                // });
                break;
        }
        for (let index = 0; index < store.length; index++) {
            store1.push(timediff(dates,store[index],0))
        }
        
        const svgString = generateSVG(store1, labelnames);
        res.set('Content-Type', 'image/svg+xml');
        res.json({svg:svgString})
    });
    
    function generateSVG(data, labels) {
        if (data.length !== labels.length) {
            throw new Error("Data and labels arrays must have the same length");
        }
    
        const maxValue = Math.max(...data.flat());
    
        const svgWidth = 200;
        const svgHeight = 150;
        const margin = { top: 20, right: 20, bottom: 20, left: 20 };
        const chartWidth = svgWidth - margin.left - margin.right;
        const chartHeight = svgHeight - margin.top - margin.bottom;
    
        const maxBars = data[0].length;
        const barWidth = chartWidth / (data.length * maxBars);
        const barSpacing = 2;
        const groupSpacing = 10;
    
        let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}">`;
    
        svg += `<g transform="translate(${margin.left}, ${margin.top})">`;
    
        data.forEach((group, i) => {
            const groupX = i * (barWidth * maxBars + barSpacing * (maxBars - 1) + groupSpacing);
            group.forEach((d, j) => {
                const barHeight = (d / maxValue) * chartHeight;
                const x = groupX + j * (barWidth + barSpacing);
                const y = chartHeight - barHeight;
    
                svg += `<rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="steelblue" />`;
    
                const labelX = x + barWidth / 2;
                const labelY = y - 5;
                svg += `<text x="${labelX}" y="${labelY}" fill="black" text-anchor="middle">${labels[i][j]}</text>`;
            });
        });
    
        svg += `</g>`;
        svg += `</svg>`;
    
        return svg;
    }
    
    
    app.post("/timedetector",async(req,res)=>{
        let dates = [date.getDate(),date.getMonth(),date.getFullYear(),date.getHours(),date.getMinutes()];
        const [email,check,name] = [(req.body.email).split("@")[0],req.body.check,req.body.name];
        let [data,temp,count,pass] = [await collection.findOne({ [email]: { $exists: true } }),0,0,1];
        data = data[email];
        switch (check) {
            case 'Workspace':
                let [wname,tasks] = [data['workspaces'],data['tasks']];
                for (let index = 0; index < wname.length; index++) {
                    const element = wname[index];
                    if (element === name) {
                        temp = index;
                        count= -1;
                        for (let index = 0; index < tasks.length; index++) {
                            const task = tasks[index];
                            if (task == 0) {
                                count++;
                            }
                            if (count === temp) {
                                temp = index;
                                break;
                            }
                        }
                        pass = 0;
                        break;
                    }
                }

                if (pass === 1) {
                    return res.json({time:"Workspace name doesn't exists"})
                }

                break;
            
            case 'Card':
                let checker = ["cards_title","cards_desc"]
                for (let index = 0; index < checker.length; index++) {
                    const element = data.cards[checker[index]];
                    for (let index1 = 0; index1 < element.length; index1++) {
                        const element1 = element[index1];
                        if (element1 === 0) {
                            count++;
                        }
                        if (element1 === name) {
                            temp = index1 - count;
                            break;
                        }
                    }
                    count = 0;
                }
                count = 0;

                for (let index = 0; index < data.tasks.length; index++) {
                    const element = data.tasks[index];
                    if (element === 1) {
                        count++;
                    }
                    if (element === temp) {
                        temp = index;
                        break;
                    }
                }

                break;

            case 'Task':
                for (let index = 0; index < data.tasks.length; index++) {
                    const task = data.tasks[index];
                    if (task === name) {
                        temp = index;
                    }
                }
                break;
        }
        
        temp = [data.date[temp][2],data.date[temp][1],data.date[temp][0],data.date[temp][3],data.date[temp][4]];
        dates = [dates[2],dates[1]+1,dates[0],dates[3],dates[4]];

        let response = timediff(temp,dates,1)+`in ${check} : ${name}`
        res.json({respo:response})
    })

    app.get("/loveit",(req,res)=>{
        res.json({x:"Ayanokoji",y:"Senku",z:"Lelouch",a:"Light"});
    })

    app.post("/loveit",(req,res)=>{
        let email = (req.body.email).split("@")[0]
        res.json({x:"Ayanokoji",y:"Senku",z:"Lelouch",a:"Light",b:"L",email:email});
    })

    app.listen(80, () => {
        console.log("Listen to: http://localhost:80/");
    });
})
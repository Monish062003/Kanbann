const express = require('express');
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser');
const {MongoClient} = require('mongodb');

app.use(express.urlencoded());
app.use(bodyParser.json());
app.use(cors())


let [db,client,collection] = '';
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
                    'date':[0,dates],
                    'current':'Workspace 1'
                }
            })
            res.json({acknowledgement : acknowledgement.insertedId})
        }
        else{
            res.json(data[`${email}`])
        }
    })

    app.post("/workspace",async(req,res)=>{
        let [email,workspace,check] = [`${req.body.email}`.split('@')[0],req.body.workspacename,req.body.check];
        let data = email + ".workspaces";
        let data1 = email + ".cards.";
        let data2 = email + ".tasks";
        let dates = email + ".date";
        let [cname,ctitle,cdesc]=[data1+"cards_name",data1+"cards_title",data1+"cards_desc"]

        if (check==0) {
            console.log(`Add : ${workspace}`)
            await collection.updateOne(
                {[email]:{ $exists : true }},  
                { $push:{ 
                    [data]: workspace,
                    [cname]: 0,
                    [ctitle]: 0,
                    [cdesc]: 0,
                    [data2]: 0,
                    [dates] : 0
                }  
            });
        }
        else if(check==1){
            let alldata = await collection.findOne(
                {[email]:{ $exists : true }}
            );
            let [cards_name,cards_desc,cards_title,tasks,cdates]=[alldata[`${email}`]['cards']['cards_name'],alldata[`${email}`]['cards']['cards_desc'],alldata[`${email}`]['cards']['cards_title'],alldata[`${email}`]['tasks'],alldata[`${email}`]['date']]
            let cardsdata = []
            let index = null;
            let count=-1;

            alldata[email]['workspaces'].forEach((nworkspace,index1) => {
                if (nworkspace==workspace) {
                    index=index1
                }
            });

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
            cdates.splice(cardsdata[0],count-cardsdata[0]);

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
            let [card_title,card_desc,pos]= [req.body.cardtitle,req.body.carddesc,req.body.position]
            let datas = await collection.findOne({[email]:{ $exists : true }});
            datas = datas[email];
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
                        $each : [dates],
                        $position : pos
                    }  
                  }
                }
            );
            res.json(venom);
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
            cdates.splice(count,1);
            
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
            
            cards_names.forEach((cardname,index) => {
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
            await collection.updateOne({[email]:{ $exists : true }},{$push:{[`${taskstring}`]:{$each:[task],$position:indo}}}) 
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
            // console.log(tasks)
            // console.log(splitx)
            await collection.updateOne(
                { [email]: { $exists: true } },
                {
                  $set: {
                    [taskstring]: tasks
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
        let [email,workspace] = [`${req.body.email}`.split('@')[0],req.body.workspace];
        let data = await collection.findOne({[email]:{ $exists : true }});
        collection.updateOne(
            { [email]: { $exists: true } }, 
            { $set: { [`${email}.current`]: workspace } }
        )         
        let [cards_name,cards_desc,cards_title,tasks]=[data[`${email}`]['cards']['cards_name'],data[`${email}`]['cards']['cards_desc'],data[`${email}`]['cards']['cards_title'],data[`${email}`]['tasks']];
        let [index,count,alldata,newdata,newtask,array]=[null,-1,[cards_name,cards_title,cards_desc],[],[],[]];

        data[`${email}`]['workspaces'].forEach((worksp,num) => {
            if (worksp==workspace) {
                index=num; 
            }
        });
        
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
        res.json(concatenatedArray)
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
        let [email,number,action]= [(req.body.email).split("@")[0],parseInt(req.body.num)?parseInt(req.body.num):5,parseInt(req.body.action)]
        if (action == 0) {
            let [statement,select,save] = [jsondata.tasks,``,[]]
            for (let index = 0; index < number; index++) {
                save.push(checker(save,statement.length));
                select += `${index+1}: ${statement[save[index]]}\n`
            }
            await collection.updateOne({ [email]: { $exists: true } },{ $set: { [`${email}.store`]: select } })
            res.json({email:`${email}`,statement:`${select}`})
        }
        else{
            let [statement,date] = [(await collection.findOne({[`${email}.store`]: { $exists: true }})),new Date()];
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

            await collection.updateMany({ [email]: { $exists: true } },{ $set: { [`${email}.tasks`]: tasks } });
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

    app.post("/timedetector",async(req,res)=>{
        const date = new Date();
        let dates = [date.getDate(),date.getMonth()+1,date.getFullYear(),date.getHours(),date.getMinutes()];
        const [email,check,name] = [(req.body.email).split("@")[0],req.body.check,req.body.name];
        let [data,temp] = [await collection.findOne({ [email]: { $exists: true } }),0];
        data = data[email];
        switch (check) {
            case 'Workspace':
                
                break;
            
            case 'Card':
                let checker = ["cards_title","cards_name","cards_desc"]
                for (let index = 0; index < checker.length; index++) {
                    const element = data.cards[checker[index]];
                    for (let index1 = 0; index1 < element.length; index1++) {
                        const element1 = element[index1];
                        if (element1 === name) {
                            temp = index1;
                            break;
                        }
                    }
                }
                break;

            case 'Task':
                
                break;
        }

        temp = data.date[temp];
        temp.forEach((element,index) => {
            dates[index] -= element; 
            if (dates[index] < 0) {
                dates[index] += dates[index]*(-2)
            }
        });
        dates[0] = dates[0]*24
        dates[1] = dates[1]*720
        dates[2] = dates[2]*8640

        temp = dates[4]
        dates = dates[0]+dates[1]+dates[2]+dates[3] 
        temp = dates[4]==0?`${dates} Hours`:`${dates} Hours and ${temp} Minutes`
    
        res.json({time:temp})
    })

    app.get("/loveit",(req,res)=>{
        res.json({x:"Ayanokoji",y:"Senku",z:"Lelouch",a:"Light"});
    })

    app.post("/loveit",(req,res)=>{
        let email = (req.body.email).split("@")[0]
        res.json({x:"Ayanokoji",y:"Senku",z:"Lelouch",a:"Light",b:"L",email:email});
    })

    app.listen(80, () => {
        console.log("Listen to: http://localhost:80");
    });
})
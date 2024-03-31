from django.http import HttpResponse,JsonResponse
from matplotlib.backends.backend_agg import FigureCanvasAgg
import matplotlib.pyplot as plt
from django.shortcuts import render
from datetime import datetime

def visualize(request):
    x = ["Python", "Javascript", "Java", "C++", "Rust", "Typescript"]
    y = [100, 200, 300, 200, 100, 301]

    # Create a bar plot
    fig, ax = plt.subplots()
    ax.bar(x, y)

    # Render the plot to a response
    buffer = io.BytesIO()
    canvas = FigureCanvasAgg(fig)
    canvas.print_png(buffer)
    plt.close(fig)  # Close the plot to free up resources

    # Set response content type
    response = HttpResponse(content_type='image/png')
    response.write(buffer.getvalue())
    buffer.close()

    return response
def tiger(request):
    return render(request,'index.html')

def difftime(request):
    if request.method == "POST":
        prev_date = datetime(2024, 3, 2, 2)
        curr_date = datetime(2024, 3, 15, 2)
        difference = curr_date - prev_date
        # print(request.POST['name'])
        print("Difference in hours:", difference)

    return JsonResponse({'diff' : f'{request.POST}'})


def difftime(request,prev_date,curr_date):
    prev_date = list(map(int, prev_date.split(',')))
    curr_date = list(map(int, curr_date.split(',')))
    difference = datetime(curr_date[0], curr_date[1], curr_date[2], curr_date[3], curr_date[4]) - datetime(prev_date[0], prev_date[1], prev_date[2], prev_date[3], prev_date[4])
    return JsonResponse({'diff':f'{difference}'})

## Trip rating for ridesharing app

### For Cloudfare worker deployment

### Using Hono (uses Typescript)

### Using google maps modern routing for computing data

# Deploying - or running as dev

- Clone it
- set _/my-app_ as active directory in termainal
- `npm i`
- `npm run dev`
- To deploy just run -> `npm run deploy` (cloudfare will ask to login to deploy worker)

# Problem

Imagine you were first half of two post codes and the amount you will receive for travelling from one place to another. And you are given 10s to decide,

You have a map preview from one source and nothig from the other.

From that information you have to fo a lot of guess work of how long it is going to take you and make your desition to accept or cancel.

Experienced drivers may be better at predicting.

But why do the guess work when you could have an accurate estimate with traffic condintions taken into consideraton.

# Limitations: TODO:

The origin and destination are calculated with only first half of post codes.

Same post code trips fail currently.

Some trips could be scored badly if they are just crossing a single first pert of the postcode as the distance api call could over estimate distance and time of trip.

# Implementaion:

Using tasker on android, grab the screen context and send a post request,

The request will try to extract origin and destination to do a goole maps api distance call.

From the google api response, send back how long the journey will take and also score the trip if needed.
For example, how much will it translate to per hour.

# Future implemntation:

More informatin about the toward destination trip, that will tell you how many more miles and how much longer it will add to your current hourney if you thake this trip.

More inforamtion about the end point of trips: Summarized where will this trip take you in an easyer to understand format if you dont know the the different areas and locations.

Possibly: cardinal directions from central london, and also if its outside london area and you are likely to travel back withouth a trip.

Busy areas and times destination: Capture and store historical area data to use for rating trips, this will tell you if you are going towards a busier area.

# Reasons for this project:

I remember being uber and bolt driver and accepting all trips not kowing what was coming. And sometime I would really feel bad when Im stuck in traffic, and the trip takes x3 longer but only counting the miles for the what you get paid.

# Reasons for chooing the tech:

My first website hosted was on git lab pages, it doesnt support any scripting and also it was using a gitlab url and domain. 

When I wated to host someting with a custom domain, cloudfare was one option to buy and manage domains. And it does have free hosting of web pages, auto deployment when you connect to a git repository and make commits.
I explored a little bit back then and remembered workers but it was too much for what I knew back then about deploying some apps.

After doing a quick search for I discovered it is either WASM or javascript, and some how I discovered hono quickstart page where it describes just to run the commands to create, install node modules and run to test it.
Having the quick start it was a good place to experiement and play with postman to see if what I was trying to do was somtihgn I could Implement.

Next I was just curious as it was just ```npn run deply``` it can't be that easy to deploy, It doesnt even know my account details for cloudfare right. But It just launched a chrome window asking me to allow connecton and then it deplyed. End points working like magic.

Google maps API because I remembered how much I could do with that from my time in university and I guessed I can get the information about journey estimates while using google Maps it in the web or mobile apps, surely there is an api for that.

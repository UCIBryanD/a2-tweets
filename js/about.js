function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	

	var firstDate = tweet_array[0].time;
	var lastDate = tweet_array[0].time;
	

	const count_src  = {
		completed_event: 0,
		live_event: 0,
		achievement: 0,
		miscellaneous: 0
	};

	for(var i = 0; i < tweet_array.length; ++i) {
		var currDate = tweet_array[i].time;
		//console.log(currDate);
		if (currDate < firstDate) {firstDate = currDate;}
		if (currDate > lastDate) {lastDate = currDate;}
		count_src[tweet_array[i].source] += 1;
	}
	/*
	console.log(typeof firstDate);
	console.log(firstDate);
	console.log(lastDate);*/

	const options = {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	};
	document.getElementById('firstDate').innerText = firstDate.toLocaleDateString("en-US", options);
	document.getElementById('lastDate').innerText = lastDate.toLocaleDateString("en-US", options);


	// formatting for grabbing classes/value of class
	const event_classes = ["completedEvents", "liveEvents", "achievements", "miscellaneous"];
	const class_to_cnt = ["completed_event", "live_event", "achievement", "miscellaneous"];


	// fill spans with data
	for (var i = 0; i < event_classes.length; ++i) {
		const span_arr = document.querySelectorAll("." + event_classes[i]);
		span_arr.forEach((ele) => {
			console.log(ele.innerText);
			ele.innerText = count_src[class_to_cnt[i]];
		});
		const span_pct = document.querySelectorAll("." + event_classes[i] + "Pct");
		span_pct.forEach((ele) => {
			ele.innerText = math.format((100 * count_src[class_to_cnt[i]] / tweet_array.length), { notation: 'fixed', precision: 2 }) + "%";
		});
	}
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});
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
	
	
	console.log(firstDate);
	console.log(lastDate);

	//console.log(tweet_array);
	for(var i = 0; i < tweet_array.length; ++i) {
		var currDate = tweet_array[i].time;
		//console.log(currDate);
		if (currDate < firstDate) {firstDate = currDate;}
		if (currDate > lastDate) {lastDate = currDate;}
	}

	console.log(typeof firstDate);
	console.log(firstDate);
	console.log(lastDate);


	const options = {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	};
	document.getElementById('firstDate').innerText = firstDate.toLocaleDateString("en-US", options);
	document.getElementById('lastDate').innerText = lastDate.toLocaleDateString("en-US", options);



}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});
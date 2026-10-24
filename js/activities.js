function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	var cnt_categories = 0;
	var tweet_categories = {};
	for (var i = 0; i < tweet_array.length; ++i) {
		//console.log(tweet_array[i]);
		//console.log(tweet_array[i].activityType);
		if (Object.hasOwn(tweet_categories, tweet_array[i].activityType)) {tweet_categories[tweet_array[i].activityType] += 1;}
		else {tweet_categories[tweet_array[i].activityType] = 1; cnt_categories += 1;}
	}

	console.log(tweet_categories);
	const keys = Object.keys(tweet_categories);
	var first = keys[0];
	var second = keys[1];
	var third = keys[2];

	for (var i = 3; i < keys.length; ++i) {
		//console.log(keys[i] + tweet_categories[keys[i]]);
		if (tweet_categories[keys[i]] > tweet_categories[first]) {
			third = second;
			second = first;
			first = keys[i];
		}
		else if (tweet_categories[keys[i]] > tweet_categories[second]) {
			third = second;
			second = keys[i];
		}
		else if (tweet_categories[keys[i]] > tweet_categories[third]) {
			third = keys[i];
		}
	}

	const top_act = [first, second, third];
	const top_time = {};
	//var summation = 0;
	console.log(top_act);
	for (var i = 0; i < tweet_array.length; ++i) {
		for (var j = 0; j < top_act.length; ++j) {
			if (tweet_array[i].activityType == top_act[j]) {
				if (Object.hasOwn(top_time, tweet_array[i].activityType))  {
					top_time[top_act[j]] += tweet_array[i].distance;
					//if (tweet_array[i].activityType == "run") {
						//summation += tweet_array[i].distance;
						//console.log(tweet_array[i].text);
						//console.log(tweet_array[i].distance);
					//}
				}
				else {
					top_time[top_act[j]] = tweet_array[i].distance
				}
				break;
			}
		}
	}
	console.log(top_time);

	const avg_time = {};
	var longest_cat = top_act[0];
	var shortest_cat = top_act[1];
	var longest_avg = 0;
	var shortest_avg = Infinity;
	for (var i = 0; i < top_act.length; ++i) {
		const avg = top_time[top_act[i]] / tweet_categories[top_act[i]];
		avg_time[top_act[i]] = avg;
		if (avg > longest_avg) {
			longest_cat = top_act[i];
			longest_avg = avg;
		}
		if (avg < shortest_avg) {
			shortest_cat = top_act[i];
			shortest_avg = avg;
		}
	}
	console.log(avg_time);




	// calculate avg len of the longest activity on weekends vs weekdays
	var weekday_ct = 0;
	var weekend_ct = 0;
	var weekday_len = 0;
	var weekend_len = 0;
	for (var i = 0; i < tweet_array.length; ++i) {
		if (tweet_array[i].distance == -1) {continue;}
		const curr_date = tweet_array[i].time;
		if (curr_date.getDay() == 0 || curr_date.getDay() == 6) {
			weekend_ct += 1;
			weekend_len += tweet_array[i].distance;
		}
		else {
			weekday_ct += 1;
			weekday_len += tweet_array[i].distance;
		}
	}
	//console.log(weekday_ct + " " + weekday_len);
	//console.log(weekend_ct + " " + weekend_len);
	var longest_dow = "weekdays";
	if (weekday_len / weekday_ct < weekend_len / weekend_ct) {
		longest_dow = "weekends";
	}
	

	



	//console.log("num cat: " + cnt_categories);
	//console.log(tweet_categories);

	document.getElementById('numberActivities').innerText = cnt_categories;
	document.getElementById('firstMost').innerText = first;
	document.getElementById('secondMost').innerText = second;
	document.getElementById('thirdMost').innerText = third;
	document.getElementById('longestActivityType').innerText = longest_cat;
	document.getElementById('shortestActivityType').innerText = shortest_cat;
	document.getElementById('weekdayOrWeekendLonger').innerText = longest_dow;
















	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.

	var tweets_data = [];

	for (var i = 0; i < tweet_array.length; ++i) {
		for (var j = 0; j < top_act.length; ++j) {
			if (tweet_array[i].activityType == top_act[j]) {
				tweets_data.push(
					{
						category: tweet_array[i].activityType,
						day: tweet_array[i].time,
						distance: tweet_array[i].distance
					}
				);
			}
		}
	}
	



	//console.log(tweets_data);
	var activity_entries = Object.entries(tweet_categories);
	var activity_array = activity_entries.map(function(kv_pair) {
		return {
			"category": kv_pair[0],
			"count": kv_pair[1]
		}
	});
	
	

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": activity_array
	  },
	  mark: "point",
	  encoding: {
		x: {
			field: "category",
			type: "nominal",
		},
		y: {
			field: "count",
			type: "quantitative"
		},
		color: {
			field: "category",
			type: "nominal"
		}
	  },
	  //TODO: Add mark and encoding
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.

	distance_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the distance of the top 3 activities by day.",
	  "data": {
	    "values": tweets_data
	  },
	  mark: "point",
	  encoding: {
		x: {
			field: "day",
			type: "temporal",
			timeUnit: "day",
		},
		y: {
			field: "distance",
			type: "quantitative"
		},
		color: {
			field: "category",
			type: "nominal"
		}
	  },
	  //TODO: Add mark and encoding
	};

	vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});

	distance_vis_agg_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the aggregate mean distance of the top 3 activities by day.",
	  "data": {
	    "values": tweets_data
	  },
	  mark: "point",
	  encoding: {
		x: {
			field: "day",
			type: "temporal",
			timeUnit: "day",
		},
		y: {
			aggregate: "mean",
			field: "distance",
			type: "quantitative"
		},
		color: {
			field: "category",
			type: "nominal"
		}
	  },
	  //TODO: Add mark and encoding
	};

	vegaEmbed('#distanceVisAggregated', distance_vis_agg_spec, {actions:false});
}


function toggle_vega() {
	const vega_btn = document.getElementById("aggregate");
	const distance_vis = document.getElementById("distanceVis");
	const distance_vis_agg = document.getElementById("distanceVisAggregated");
	
	var show_agg = true;
	distance_vis.hidden = false;
	distance_vis_agg.hidden = true;
	vega_btn.innerText = "Show means";

	vega_btn.addEventListener("click", function (event) {
		if (show_agg) {
			vega_btn.innerText = "Show all activities";
			show_agg = !show_agg;
		}
		else {
			vega_btn.innerText = "Show means";
			show_agg = !show_agg;
		}
		distance_vis.hidden = !distance_vis.hidden;
		distance_vis_agg.hidden = !distance_vis_agg.hidden;
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
	toggle_vega();
});


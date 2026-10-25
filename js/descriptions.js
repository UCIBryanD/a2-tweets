var user_array = [];
function parseTweets(runkeeper_tweets) {
	
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	//TODO: Filter to just the written tweets
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	for (var i = 0; i < tweet_array.length; ++i) {
		if (tweet_array[i].written) {
			console.log("written");
			user_array.push(tweet_array[i]);
		}
	}
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	const input_box = document.getElementById("textFilter");
	const search_text = document.getElementById("searchText");
	const search_count = document.getElementById("searchCount");
	const query_table = document.getElementById("tweetTable");
	input_box.addEventListener("input", function() {
		const query = input_box.value;
		console.log(query);

		search_text.innerText = query;
		
		query_table.innerHTML = "";
		search_count.innerText = 0;
		if (query != "") {
			var match_tweets = []
			var row_num = 0;
			for (var i = 0; i < user_array.length; ++i) {
				if (user_array[i].text.toLowerCase().includes(query.toLowerCase())) {
					//match_tweets.push(user_array[i]);
					row_num += 1;
					query_table.insertAdjacentHTML("beforeend", user_array[i].getHTMLTableRow(row_num));
					console.log("pass");
				}
			}

			search_count.innerText = row_num;
			//console.log(user_array);
			//for (var i = 0; i < match_tweets.length; ++i) {
			//	query_table.innerHTML += match_tweets[i].getHTMLTableRow(i + 1);
			//}
		}
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
	addEventHandlerForSearch();
});
class Tweet {
	private text:string;
	time:Date;


	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
        
        var msg_type:string = "miscellaneous";

        if (this.text.startsWith("Just completed") || this.text.startsWith("Just posted")) {msg_type = "completed_event";}
        else if (this.text.startsWith("Watch my")) {msg_type = "live_event";}
        else if (this.text.startsWith("Achieved a")) {msg_type = "achievement";}

        return msg_type;
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        //TODO: identify whether the tweet is written
        if (this.text.includes("@Runkeeper")) {return false;}
        return true;
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        //TODO: parse the written text from the tweet
        var index_user = this.text.indexOf("-");
        var index_http = this.text.indexOf("http");
        if (index_user != -1 && index_http != -1) {
            if (index_user + 2 < this.text.length) {
                return this.text.substring(index_user + 2, index_http);
            }
        }
        return "";
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        /*
        const activities= ["run", "walk", "bike", "exercise", "workout", "swim", "yoga"]
        for (var i:number = 0; i < activities.length; ++i) {
            if (this.text.includes(" " + activities[i])) {return activities[i];}
        }*/
       var oneinquestion:string = "ha";
        var strip_index:number = -1;
        var activity_type:string = "";
        if (this.text.includes(" km ")) {strip_index = this.text.indexOf(" km ")}
        else if (this.text.includes(" mi ")) {strip_index = this.text.indexOf(" mi ")}
        if (strip_index != -1 && strip_index + 4 < this.text.length) {
            //console.log(this.text.substring(strip_index + 4));
            var matches = this.text.substring(strip_index + 4).match(/\w+/);
            //console.log(matches);
            if (matches) {
                
                activity_type = matches[0];
                //if (activity_type == oneinquestion) {console.log(activity_type + " phase 1: " + this.text);
                //    console.log(matches);
                //}
            }
            return activity_type;
        }
        strip_index = this.text.indexOf("posted a ");
        if (strip_index != -1 && strip_index + 9 < this.text.length) {
            var matches = this.text.substring(strip_index + 9).match(/\w+/);
            if (matches) {
                activity_type = matches[0];
                //if (activity_type == oneinquestion) {console.log(activity_type + "phase 2 : " + this.text);
                //    console.log(matches);
                //}
            }
            return activity_type;
        }

        return "unknown";
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        var distance:number = Number(this.text.match(/\d+(\.\d+)?/)?.[0] ?? NaN);
        if (distance == -1) {return -1;}
        //console.log("extracted distance: " + distance);
        //if (distance > 100) {console.log(this.text);}
        if (this.text.includes(" km")) {return distance / 1.609;}
        return distance;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        const row_index = "<td>" + rowNumber + "</td>"; 
        const row_type = "<td>" + this.activityType + "</td>";
        var row_data = "<td>";

        //const parsed = this.text.split(" ");

        const link_index = this.text.indexOf("https");
        //console.log(this.text.substring(link_index));
        const link_end_index = this.text.substring(link_index).indexOf(" ") + link_index;
        //const link_end_index = link_index + 23;
        /*
        for (var i = 0; i < parsed.length; ++i) {
            if (parsed[i].startsWith("http")) {
                row_data += '<a href="' + parsed[i] + '">' + parsed[i] + '</a> ';
            }
            else {
                row_data += parsed[i] + " ";
            }
        }
        */
        const link = this.text.substring(link_index, link_end_index);
        row_data += this.text.substring(0, link_index) 
            + '<a href="' + link + '">' + link + '</a>' +
            this.text.substring(link_end_index);
        row_data += "</td>";
        //console.log(this.text);
        return "<tr>" + row_index + row_type + row_data + "</tr>";
    }
}
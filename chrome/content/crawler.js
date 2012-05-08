const Cc = Components.classes;
const Ci = Components.interfaces;


function GetRandomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function OpenFile(path){
    var localfileCID = '@mozilla.org/file/local;1';
    var localfileIID =Components.interfaces.nsILocalFile;
    try {
	var file = Components.classes[localfileCID].createInstance(localfileIID);
	file.initWithPath(path);
	return file;
    }
    catch(e) {
	return false;
    }
}

var fbProfCrawler = {
    _cnt: 0,
    _counter: 1,
    getRandomInt:function(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
    },

   onload:function(e){
	let doc = e.target;
	let id;
	// http://www.facebook.com/profile.php?id=100000981883511&v=info
	// http://www.facebook.com/your.name?v=info

	if(e.target.location.href.match(/^https*:\/\/www\.facebook\.com\/(.*)[&?]v=info/)){
	    Application.console.log('location='+e.target.location.href);
	    let id;
	    try{
			id = e.target.location.href.match(/^https*:\/\/.*profile\.php\?id=(\d+)&v=info/)[1];
	    }
	    catch(err){
			id = e.target.location.href.match(/^https*:\/\/www\.facebook\.com\/(.*)\?v=info/)[1];
	    }
	    Application.console.log('id='+id);
	    try{
		//fbProfCrawler.saveDOM(id, doc.getElementById('pagelet_tab_content') );
		fbProfCrawler.saveDOM(id, doc.getElementById('content') );
	    }catch(e){
			Application.console.log(e);
	    }

	}

	},

    saveDOM:function(id,dom){
	let s = new XMLSerializer();
	let str = s.serializeToString(dom);
		if(str.length>1000){
			document.getElementById('console').value = "Saving " + id + "...";
			this.saveText(id,str);
			document.getElementById('content').value = str;
			document.getElementById('counter').value = "crawled " + this._counter + " users.";
			this._counter ++;
			return;
		}
    },

    saveText:function(id,text){
	//let file = OpenFile("/Users/amano/Desktop/facebook/profs/json/"+id+".json");
	let file = OpenFile("/home/shin/Documents/html/"+id+".html");
	//let file = OpenFile("y:\\psa\\fbprofs\\html\\"+id+".html");
	let os;
	if( !file ) {
		Application.console.log("cannot open file");
	}

	os = Components.classes['@mozilla.org/network/file-output-stream;1'].createInstance(Components.interfaces.nsIFileOutputStream);
	let flags = 0x02|0x20|0x08;// wronly|truncate|create
	os.init(file,flags,0664,0);

	let cos = Components.classes["@mozilla.org/intl/converter-output-stream;1"].createInstance(Components.interfaces.nsIConverterOutputStream);
	cos.init(os,"UTF-8",0,Components.interfaces.nsIConverterOutputStream.DEFAULT_REPLACEMENT_CHARACTER);

	cos.writeString(text);
	cos.close();
	Application.console.log(text);
    },

    accessProfile:function(id){
    	//let url = 'https://graph.facebook.com/'+id+this.access_token;
		let url = 'http://www.facebook.com/profile.php?id='+id+'&v=info';

		
		document.getElementById('fb-current-id').value = url;
		this.browser.setAttribute('src',url);
	},

    crawlNext:function(){
	let id = document.getElementById('fb-prof-id').value;
	let id;
	if( !id ){
	/*
	    id = fb_userid[this._cnt];
	    this._cnt++;
	*/
	id = this.idGenerator();
	}
	if(id){
		document.getElementById('console').value = "Visiting " + id + "...";
	    this.accessProfile(id);
	}
    },
	
	idGenerator:function(){
		var ranNum = Math.floor(Math.random()*10000000000);
		var ID = ranNum.toString();
		var numOfZeros = 0;
		
		if(Math.random()> 0.7)
		{
			numOfZeros = 15 - ID.length- 1;
			for(i=1; i<=numOfZeros; i++){
				ID = "0" + ID;
			}
			ID = "1" + ID;
		}
		return ID;
	},
	
	getLanguage:function(id){
			var xmlhttp;
			var profile = null;
			var url = "https://graph.facebook.com/" + id;
			if (window.XMLHttpRequest)
			  {// code for IE7+, Firefox, Chrome, Opera, Safari
				xmlhttp=new XMLHttpRequest();
			  }
			else
			  {// code for IE6, IE5
				xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
			  }

			xmlhttp.open("GET",url,false);
			xmlhttp.send();
			profile = eval("("+xmlhttp.responseText+")"); 
			if(profile != null){
					return profile.locale;
				}
			},
	
    extractProfile2:function(){
	alert("extracting-_-!\n");

	let file = OpenFile("/home/shin/Documents/extracted_data.sql");
	
	//let file = OpenFile("y:\\psa\\extracted_data.sql");
	let os;

	os = Components.classes['@mozilla.org/network/file-output-stream;1'].createInstance(Components.interfaces.nsIFileOutputStream);
	
	let flags = 0x02|0x20|0x08;// wronly|truncate|create
		
	os.init(file,flags,0664,0);
		

	let cos = Components.classes["@mozilla.org/intl/converter-output-stream;1"].createInstance(Components.interfaces.nsIConverterOutputStream);
		
	cos.init(os,"UTF-8",0,Components.interfaces.nsIConverterOutputStream.DEFAULT_REPLACEMENT_CHARACTER);
		
	
	let dir = OpenFile("/home/shin/Documents/html");
	let entries = dir.directoryEntries;
	/*
//******************get id list************************
	let idList = OpenFile("F:\\data\\munemasa\\fb_userid.js");
	let ios;

	ios = Components.classes['@mozilla.org/network/file-output-stream;1'].createInstance(Components.interfaces.nsIFileOutputStream);
	
	let flags = 0x02|0x20|0x08;// wronly|truncate|create
		
	ios.init(idList,flags,0664,0);
	let idos = Components.classes["@mozilla.org/intl/converter-output-stream;1"].createInstance(Components.interfaces.nsIConverterOutputStream);
	idos.init(ios,"UTF-8",0,Components.interfaces.nsIConverterOutputStream.DEFAULT_REPLACEMENT_CHARACTER);

	while(entries.hasMoreElements()){
	    var entry = entries.getNext();
	    entry.QueryInterface(Components.interfaces.nsIFile);

	    var IOService = Cc['@mozilla.org/network/io-service;1'].getService(Ci.nsIIOService);
	    var localFile = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsILocalFile);
		
		var leafName = entry.leafName.toString();
		var userId = leafName.substring(0,leafName.lastIndexOf("."));

		var idString = '"' + userId + '",\n';

		idos.writeString(idString);
	}
	idos.close();
//*****************end of get id list********************
*/
	while(entries.hasMoreElements()){

	    var entry = entries.getNext();
	    entry.QueryInterface(Components.interfaces.nsIFile);

	    var IOService = Cc['@mozilla.org/network/io-service;1'].getService(Ci.nsIIOService);
	    var localFile = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsILocalFile);
		var path = entry.path.toString();
		var leafName = entry.leafName.toString();
		var userId = leafName.substring(0,leafName.lastIndexOf("."));
		var userLanguage = this.getLanguage(userId);
		
		if(typeof(userLanguage)== "undefined"){
			userLanguage = "Unknown";
		}
	
		
		
	    localFile.initWithPath( entry.path );

	    var uri = IOService.newFileURI(localFile);
	    //alert( uri.spec );

	    var req = new XMLHttpRequest();
	    req.open('GET', uri.spec, false); 
	    req.send(null);

	    if(req.status == 0){
		let parser = new DOMParser();
		let dom = parser.parseFromString( req.responseText,"text/xml");
		if( !dom ) continue;

		let setting = {
			IM_screen_name: false,
		    posts_by_me: false,
		    family: false,
		    relationships: false,
		    interested_in_and_looking_for: false,
		    bio_and_favorite: false,
		    website: false,
		    religious_and_political: false,
		    birthday: false,
		    mobile_phone: false,
		    other_phone: false,
		    address: false,
		    email: false,
			
		    attr:{
			name:undefined,
			birthday: undefined,
			blood_type: undefined,
			language: undefined,
			sex: undefined, // Male, Female
			age: 999,       // 10s,20s,30s,...
			school: undefined,
			location: undefined, // place name
			hometown: undefined,
			relationship: undefined, // Single, Married, ...
			work: undefined,         // Employee, Student, ...
			looking_for: undefined,   // Networking, Friendship, ...
			numberOfFriends: undefined,
			friendsList: undefined,
			groupByNumOfFriends: undefined,
			language:undefined,
			privacy_score:0
		    }
		};
/*
		try{
		    if( dom.getElementById('profile_tabs').textContent.match(/Wall/) ){
			setting.posts_by_me = true;
		    }
		} catch (x) {
		 
		    continue;
		}
*/
		let v = dom.getElementsByClassName('label');
		let d = dom.getElementsByClassName('data');
		let p = dom.getElementsByClassName('fbProfileBylineLabel');
		if( v.length==0 || d.length==0 ) continue;
		if( v.length != d.length ) continue;
		setting.attr.language = userLanguage;
		for(let i=0; i<p.length; i++){
			let profileLine = p[i].textContent;
			if(profileLine.indexOf("Works at")!= -1){
				setting.attr.work = profileLine.substr(profileLine.indexOf("Works at")+8);
				break;
				}
			if(profileLine.indexOf("Studied at")!= -1 || profileLine.indexOf("Studies at")!= -1){
				setting.attr.school = profileLine.substr(profileLine.indexOf("at")+2);
				break;
				}
			if(profileLine.indexOf("Lives in")!= -1){
				setting.attr.location = profileLine.substr(profileLine.indexOf("Lives in")+8);
				break;
				}
			if(profileLine.indexOf("Knows")!= -1){
				setting.attr.language = profileLine.substr(profileLine.indexOf("Knows")+5);
				break;
				}		
			if(profileLine.indexOf("From")!= -1){
				setting.attr.hometown = profileLine.substr(profileLine.indexOf("From")+4);
				break;
				}		
			if(profileLine.indexOf("Born on")!= -1){
				setting.birthday = true;
				setting.attr.birthday = profileLine.substr(profileLine.indexOf("Born on")+7);
				break;
				}		
			if(profileLine.indexOf("Blood Type is")!= -1){
				setting.attr.blood_type = profileLine.substr(profileLine.indexOf("Blood Type is")+13);
				break;
				}					
		}
		
		for(let j=0; j<v.length; j++){
		    let item = v[j];
		    let label = item.textContent;
		    let data = d[j].textContent;
			
		    // Gender
			
		    if( label.indexOf("Sex")!=-1 ){
			setting.attr.sex = data;
			setting.attr.privacy_score += 1.0;
		    }
			
		    if( label.indexOf("Current City")!=-1 ){
			setting.attr.location = data;
			setting.attr.privacy_score += 4.0;
		    }
		    if( label.indexOf("Hometown")!=-1 ){
			setting.attr.hometown = data;
			setting.attr.privacy_score += 4.0;
		    }
		    // Birthday
		    if( label.indexOf("Birthday")!=-1 ){
			setting.birthday = true;
			setting.attr.privacy_score += 2.0;
			
			try{
			    let birthyear = data.match(/,\s*(\d+)$/)[1];
			    Application.console.log("birth year:"+birthyear+"\n");
			    let currentyear = (new Date()).getFullYear();
			    let age = parseInt((currentyear - birthyear)/10)*10;
			    setting.attr.age = age;
			} catch (x) {
			    setting.attr.age = 999;
			}
		    }
		    // Family
		    if( label.indexOf("Parents")!=-1 ||
			label.indexOf("Siblings")!=-1 ||
			label.indexOf("Children")!=-1 ){
			    setting.family = true;
				setting.attr.privacy_score += 2.0;
			}
		    // Relationships
		    if( label.indexOf("Relationship Status")!=-1 ){
			setting.relationships = true;
			setting.attr.privacy_score += 3.0;
			try{
			    setting.attr.relationship = data.match(/(Single|In a Relationship|Engaged|Married|Complicated|In an Open Relationship|Widowed)/)[1];
			} catch (x) {
			    Application.console.log(x);
			}
		    }

		    // Interested in and Looking for
		    if( label.indexOf("Interested In")!=-1 ){
			setting.interested_in_and_looking_for = true;
			setting.attr.privacy_score += 1.0;
		    }
		    if(label.indexOf("Looking For")!=-1 ){
			setting.interested_in_and_looking_for = true;
			setting.attr.privacy_score += 1.0;
			setting.attr.looking_for = data;
		    }

		    // Bio and favorite quotations
		    if( label.indexOf("Bio")!=-1 || label.indexOf("Favorite Quotations")!=-1 ){
			setting.bio_and_favorite = true;
			setting.attr.privacy_score += 1.0;
		    }
		    // Religious and political views
		    if( label.indexOf("Political")!=-1 ||
			label.indexOf("Religious")!=-1 ){
			    setting.religious_and_political = true;
				setting.attr.privacy_score += 2.0;
			}

		    if( label.indexOf("Employers")!=-1 ){
			setting.attr.work = "Employee";
			setting.attr.privacy_score += 1.0;
		    }

		    if( label.indexOf("Grad School")!=-1){
			if( !setting.attr.work ){
			    try{
				let y = data.match(/'(\d+)/)[1];			    
				if( y>5 ){
				    setting.attr.work = "Student";
				}
			    } catch (x) {
			    }
			}
		    }
		    if( label.indexOf("College")!=-1){
			if( !setting.attr.work ){
			    try{
				let y = data.match(/'(\d+)/)[1];			    
				if( y>6 ){
				    setting.attr.work = "Student";
				}
			    } catch (x) {
			    }
			}
		    }
		    if( label.indexOf("High School")!=-1){
			if( !setting.attr.work ){
			    try{
				let y = data.match(/'(\d+)/)[1];
				if( y>7 ){
				    setting.attr.work = "Student";
				}
			    } catch (x) {
			    }
			}
		    }

		    // Email
		    if( label.indexOf("Email")!=-1 ){
			setting.email = true;
			setting.attr.privacy_score += 2.0;
		    }
		    // Mobile phone
		    if( label.indexOf("Mobile Phone")!=-1 ){
			setting.mobile_phone = true;
			setting.attr.privacy_score += 4.0;
		    }
		    // Other phone
		    if( label.indexOf("Other Phone")!=-1 ){
			setting.other_phone = true;
			setting.attr.privacy_score += 4.0;
		    }
		    // Address
		    if( label.indexOf("Address")!=-1 ){
			setting.address = true;
			setting.attr.address = data;
			setting.attr.privacy_score += 4.0;
		    }
		    // IM screen name
		    if( label.match(/(AIM|Gadu-Gadu|ICQ|Google Talk|Skype|Yahoo|QQ|NateOn)/) ){
			setting.IM_screen_name = true;
		    }
		    // Website
		    if( label.indexOf("Website")!=-1 ){
			setting.website = true;
			setting.attr.privacy_score += 1.0;
		    }
		}// end of for
		// プロフィール編集で性別を非表示にしていても、
		// add him/her as a friendのメッセージを読むことで性別が分かる.
		if( !setting.attr.sex ){
		    try{
			let sex = dom.getElementById("can_see_profile_add_friend");
			Application.console.log(sex);
			if( sex.textContent.indexOf("him")!=-1 ){
			    sex = "Male";
			}else if( sex.textContent.indexOf("her")!=-1 ){
			    sex = "Female";
			}else {
			    sex = undefined;
			}
			Application.console.log(sex + "\n");
			setting.attr.sex = sex;
		    }
		    catch(x){
			Application.console.log(x+"\n");
			continue;
		    }
		}

		//Application.console.log(JSON.stringify(setting));

		//let sql = "insert into facebook (posts_by_me,family) values(1,2);";
		let name = new Array();
		let value = new Array();
		if( setting.posts_by_me ){
		    name.push('posts_by_me');
		    value.push(5);
		}
		if( setting.family ){
		    name.push('family');
		    value.push(5);
		}
		if( setting.relationships ){
		    name.push('relationships');
		    value.push(5);
		}
		if( setting.interested_in_and_looking_for ){
		    name.push('interested_in_and_looking_for');
		    value.push(5);
		}
		if( setting.bio_and_favorite ){
		    name.push('bio_and_favorite_quotations');
		    value.push(5);
		}
		if( setting.website ){
		    name.push('website');
		    value.push(5);
		}
		if( setting.religious_and_political ){
		    name.push('religious_and_political_views');
		    value.push(5);
		}
		if( setting.birthday ){
		    name.push('birthday');
		    value.push(5);
		}
		if( setting.mobile_phone ){
		    name.push('mobile_phone');
		    value.push(5);
		}
		if( setting.other_phone ){
		    name.push('other_phone');
		    value.push(5);
		}
		if( setting.address ){
		    name.push('address');
		    value.push(5);
		}
		if( setting.IM_screen_name ){
		    name.push('im_screen_name');
		    value.push(5);
		}
		if( setting.email ){
		    name.push('mail_address1');
		    value.push(5);
		}
		name.push('prof_age');
		value.push(setting.attr.age);

		if( setting.attr.sex ){
		    name.push('prof_gender');
		    value.push('"'+setting.attr.sex+'"');
		}
		if( setting.attr.location ){
		    name.push('prof_location');
		    value.push('"'+setting.attr.location+'"');
		}
		if( setting.attr.hometown ){
		    name.push('prof_hometown');
		    value.push('"'+setting.attr.hometown+'"');
		}
		if( setting.attr.relationship ){
		    name.push('prof_relationship');
		    value.push('"'+setting.attr.relationship+'"');
		}
		if( setting.attr.work ){
		    name.push('prof_currentwork');
		    value.push('"'+setting.attr.work+'"');
		}
		if( setting.attr.looking_for ){
		    name.push('prof_purpose');
		    value.push('"'+setting.attr.looking_for+'"');
		}
		
		let kk = dom.getElementsByClassName('fcg');
		let num_of_friends = 0;
		for(i=0; i<kk.length; i++){
			if(kk[i].textContent.indexOf("Friends")!= -1){
				num_of_friends = parseInt(kk[i].textContent.substr(kk[i].textContent.indexOf("(")+1,kk[i].textContent.indexOf(")")));
			}
		}
		setting.attr.numberOfFriends = num_of_friends;
		name.push('prof_numOfFriends');
		value.push('"'+setting.attr.numberOfFriends+'"');
		if(num_of_friends == 0){setting.attr.groupByNumOfFriends="Not disclosed";}
		else if(num_of_friends <=20 ){setting.attr.groupByNumOfFriends="<=20";}
		else if(num_of_friends <=100 ){setting.attr.groupByNumOfFriends="between 20 and 100";}
		else if(num_of_friends <=1000 ){setting.attr.groupByNumOfFriends="between 100 and 1000";}
		else {setting.attr.groupByNumOfFriends="more than 1000";}
		name.push('groupByNumOfFriends');
		value.push('"'+setting.attr.groupByNumOfFriends+'"');
	
		
		let ff = dom.getElementsByClassName('UIImageBlock clearfix');
		let fid = new Array();
		let fj=0;
		for(i=0; i<ff.length; i++){
			let t = parseInt(ff[i].childNodes[0].toString().substr(ff[i].childNodes[0].toString().indexOf("=")+1));
			if(!isNaN(t)){
				fid[fj] = t;
				fj++;
			}
		}
		
		setting.attr.friendsList = fid.toString();
		name.push('prof_friendsList');
		value.push('"'+setting.attr.friendsList+'"');
		
		name.push('locale');
		value.push('"'+setting.attr.language+'"');
		
		setting.attr.privacy_score *= 2012;
		setting.attr.privacy_score = setting.attr.privacy_score;
		name.push('p_score');
		value.push('"'+setting.attr.privacy_score+'"');
		
		
		let sql = "insert into facebook (";
		sql += name.join(',');
		sql += ") values (";
		sql += value.join(',');
		sql += ");\n";
		//Application.console.log(sql);

		cos.writeString(sql);
		//break;
	    }
	}
	cos.close();
	alert('finished.\n');
    },

    startup:function(){
	Application.console.log('open fbProfCrawler window');

	this.access_token = window.opener.fbProfCrawler.access_token;
	Application.console.log(this.access_token);

	this.browser = document.getElementById('fb-crawler-browser');
	this.browser.addEventListener('load',
				      function(e){
					  fbProfCrawler.onload(e);
				      },
				      true);

	//this.accessProfile('1483606740'); // me(Toshikazu Munemasa)
	//this.extractProfile2();
	   setInterval("fbProfCrawler.crawlNext()", 3000);
	   //setTimeout( function(){ fbProfCrawler.crawlNext(); }, 2000);
    }
};


window.addEventListener('load',function(){
			    fbProfCrawler.startup();
			},false);


var fbProfCrawler = {
    getRandomInt:function(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    evaluateXPath:function(aNode, aExpr) {
	var xpe = new XPathEvaluator();
	var nsResolver = xpe.createNSResolver(aNode.ownerDocument == null ?
					      aNode.documentElement : aNode.ownerDocument.documentElement);
	var result = xpe.evaluate(aExpr, aNode, nsResolver, 0, null);
	var found = [];
	var res;
	while (res = result.iterateNext())
	    found.push(res);
	return found;
    },

    onclick:function(){
	let url = window.content.location.href;

	Application.console.log('fbprofcrawler:'+url);
	try{
	    this.access_token = url.match(/https*:\/\/.*?(\?access_token=.*)/)[1];
	}
	catch(e){
	    this.access_token = "";
	}

	window.open('chrome://fbprofcrawler/content/window.xul','fb-prof-crawler','chrome,resizable=yes,centerscreen').focus();
    },


    init:function(){
    },
    destroy:function(){
    }
};

window.addEventListener("load", function() { fbProfCrawler.init(); }, false);
window.addEventListener("unload", function(){ fbProfCrawler.destroy(); }, false);

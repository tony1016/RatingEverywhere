// ==UserScript==
// @name RatingEverywhere
// @namespace https://tonylee.name
// @version 1.0
// @description Show imdb.com or douban.com rating in real time
// @match *
// @include        *
// @copyright 2018+, tonylee.name
// @require http://code.jquery.com/jquery-latest.js
// @grant        GM_xmlhttpRequest
// @connect      api.douban.com
// ==/UserScript==

(function() {
    //找到所有含有豆瓣链接的文字节点
    $('*:contains("movie.douban.com"):not(:has(*))').each(function( index ) {
    	var node=this;
    	// 抓取URL
    	var url=$(node).text().match(/(http|https):\/\/(\S*)\b/i)[0];
    	// 换成API访问
    	apiUrl=url.replace("movie.douban.com","api.douban.com/v2/movie");
    	// 获取douban评分
    	getJSON_GM(apiUrl,function(data){
    		if (isEmpty(data.rating) || isEmpty(data.rating.average)){
    			return;
    		}
    		$(node).append("<div style='display: inline-flex;border: 1px;border-style: solid;'><img id='doubanIcon' src='https://img3.doubanio.com/pics/douban-icons/favicon_24x24.png'/>"+data.rating.average+"</div>");

    	});
    });
})();


function getJSON_GM(url, callback) {
    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        onload: function(response) {
            if (response.status >= 200 && response.status < 400)
                callback(JSON.parse(response.responseText));
            else
                console.log('Error getting ' + url + ': ' + response.statusText);
        },
        onerror: function(response) {
            console.log('Error during GM_xmlhttpRequest to ' + url + ': ' + response.statusText);
        }
    });
}

function isEmpty(s) {
    return !s || s === 'N/A';
}

function time(){return Math.floor(new Date().getTime()/1000)};function uniqid(d,c){if(typeof d==="undefined"){d=""}var b;var a=function(e,f){e=parseInt(e,10).toString(16);if(f<e.length){return e.slice(e.length-f)}if(f>e.length){return Array(1+(f-e.length)).join("0")+e}return e};if(!this.php_js){this.php_js={}}if(!this.php_js.uniqidSeed){this.php_js.uniqidSeed=Math.floor(Math.random()*123456789)}this.php_js.uniqidSeed++;b=d;b+=a(parseInt(new Date().getTime()/1000,10),8);b+=a(this.php_js.uniqidSeed,5);if(c){b+=(Math.random()*10).toFixed(8).toString()}return b};function round(d,b,h){var a,c,e,g;b|=0;a=Math.pow(10,b);d*=a;g=(d>0)|-(d<0);e=d%1===0.5*g;c=Math.floor(d);if(e){switch(h){case"PHP_ROUND_HALF_DOWN":d=c+(g<0);break;case"PHP_ROUND_HALF_EVEN":d=c+(c%2*g);break;case"PHP_ROUND_HALF_ODD":d=c+!(c%2);break;default:d=c+(g>0)}}return(e?d:Math.round(d))/a};function basename(d,c){var a=d.replace(/^.*[\/\\]/g,"");if(typeof c==="string"&&a.substr(a.length-c.length)==c){a=a.substr(0,a.length-c.length)}return a};function file_get_contents(l,s,f,p,j){var J,c=[],z=[],A=0,B=0,C="",q=-1,d=0,y=null,F=false;var o=function(e){return e.substring(1)!==""};this.php_js=this.php_js||{};this.php_js.ini=this.php_js.ini||{};var r=this.php_js.ini;f=f||this.php_js.default_streams_context||null;if(!s){s=0}var I={FILE_USE_INCLUDE_PATH:1,FILE_TEXT:32,FILE_BINARY:64};if(typeof s==="number"){d=s}else{s=[].concat(s);for(B=0;B<s.length;B++){if(I[s[B]]){d=d|I[s[B]]}}}if(d&I.FILE_BINARY&&(d&I.FILE_TEXT)){throw"You cannot pass both FILE_BINARY and FILE_TEXT to file_get_contents()"}if((d&I.FILE_USE_INCLUDE_PATH)&&r.include_path&&r.include_path.local_value){var x=r.include_path.local_value.indexOf("/")!==-1?"/":"\\";l=r.include_path.local_value+x+l}else{if(!/^(https?|file):/.test(l)){C=this.window.location.href;q=l.indexOf("/")===0?C.indexOf("/",8)-1:C.lastIndexOf("/");l=C.slice(0,q+1)+l}}var w;if(f){w=f.stream_options&&f.stream_options.http;F=!!w}if(!f||!f.stream_options||F){var b=this.window.ActiveXObject?new ActiveXObject("Microsoft.XMLHTTP"):new XMLHttpRequest();if(!b){throw new Error("XMLHttpRequest not supported")}var g=F?w.method:"GET";var n=!!(f&&f.stream_params&&f.stream_params["phpjs.async"]);if(r["phpjs.ajaxBypassCache"]&&r["phpjs.ajaxBypassCache"].local_value){l+=(l.match(/\?/)==null?"?":"&")+(new Date()).getTime()}b.open(g,l,n);if(n){var a=f.stream_params.notification;if(typeof a==="function"){if(0&&b.addEventListener){}else{b.onreadystatechange=function(e){var i={responseText:b.responseText,responseXML:b.responseXML,status:b.status,statusText:b.statusText,readyState:b.readyState,evt:e};var k;switch(b.readyState){case 0:a.call(i,0,0,"",0,0,0);break;case 1:a.call(i,0,0,"",0,0,0);break;case 2:a.call(i,0,0,"",0,0,0);break;case 3:k=b.responseText.length*2;a.call(i,7,0,"",0,k,0);break;case 4:if(b.status>=200&&b.status<400){k=b.responseText.length*2;a.call(i,8,0,"",b.status,k,0)}else{if(b.status===403){a.call(i,10,2,"",b.status,0,0)}else{a.call(i,9,2,"",b.status,0,0)}}break;default:throw"Unrecognized ready state for file_get_contents()"}}}}}if(F){var H=(w.header&&w.header.split(/\r?\n/))||[];var v=false;for(B=0;B<H.length;B++){var E=H[B];var D=E.search(/:\s*/);var m=E.substring(0,D);b.setRequestHeader(m,E.substring(D+1));if(m==="User-Agent"){v=true}}if(!v){var t=w.user_agent||(r.user_agent&&r.user_agent.local_value);if(t){b.setRequestHeader("User-Agent",t)}}y=w.content||null}if(d&I.FILE_TEXT){var u="text/html";if(w&&w["phpjs.override"]){u=w["phpjs.override"]}else{var h=(r["unicode.stream_encoding"]&&r["unicode.stream_encoding"].local_value)||"UTF-8";if(w&&w.header&&(/^content-type:/im).test(w.header)){u=w.header.match(/^content-type:\s*(.*)$/im)[1]}if(!(/;\s*charset=/).test(u)){u+="; charset="+h}}b.overrideMimeType(u)}else{if(d&I.FILE_BINARY){b.overrideMimeType("text/plain; charset=x-user-defined")}}try{if(w&&w["phpjs.sendAsBinary"]){b.sendAsBinary(y)}else{b.send(y)}}catch(G){return false}J=b.getAllResponseHeaders();if(J){J=J.split("\n");for(A=0;A<J.length;A++){if(o(J[A])){z.push(J[A])}}J=z;for(B=0;B<J.length;B++){c[B]=J[B]}this.$http_response_header=c}if(p||j){if(j){return b.responseText.substr(p||0,j)}return b.responseText.substr(p)}return b.responseText}return false};function urldecode(a){return decodeURIComponent((a+"").replace(/%(?![\da-f]{2})/gi,function(){return"%25"}).replace(/\+/g,"%20"))};
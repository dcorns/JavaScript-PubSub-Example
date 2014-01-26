var publisher = {
    subscribers: {
        any: []
    },
    subscribe: function (fn, type) {
        type = type || 'any';
        if (typeof this.subscribers[type] === "undefined") {
            this.subscribers[type] = [];
        }
        this.subscribers[type].push(fn);
    },
    unsubscribe: function (fn, type) {
        this.visitSubscribers('unsubscribe', fn, type);
    },
    publish: function (publication, type) {
        this.visitSubscribers('publish', publication, type);
    },
    visitSubscribers: function (action, arg, type) {
        var pubtype = type || 'any',
            subscribers = this.subscribers[pubtype],
            i,
            max = subscribers.length;

        for (i = 0; i < max; i += 1) {
            if (action === 'publish') {
                subscribers[i](arg);
            } else {
                if (subscribers[i] === arg) {
                    subscribers.splice(i, 1);
                }
            }
        }
    }
};

function makePublisher(o) {
    var i;
    for (i in publisher) {
        if (publisher.hasOwnProperty(i) && typeof publisher[i] === "function") {
            o[i] = publisher[i];
        }
    }
    o.subscribers = {any: []};
}


var Books={
		add:function(titletoadd){
			this.publish(titletoadd,'add');
		},
		remove:function(titletoremove){
			this.publish(titletoremove,'remove');
		},
		enshelf:function(shelf,title){
			var c=0;
			while(c<Shelves.shelves.length){
				if(Shelves.shelves[c].name==shelf){
					Shelves.shelves[c].titles.push(title);
				}
				c++;
			}
			Shelves.ShelfSelected();
			Library.BookSelected();
		},
		unshelf:function(title){
			var c=0;
			while(c<Shelves.shelves.length){
				var tc=0;
				while(tc<Shelves.shelves[c].titles.length){
					if(Shelves.shelves[c].titles[tc]==title){
						Shelves.shelves[c].titles.splice(tc,1);
					}
					tc++;
				}
				c++;
			}
			Shelves.ShelfSelected();
			Library.BookSelected();
		}
};



makePublisher(Books);



var Shelves={
	shelves:[],
	add:function(name){
		if(name.length>0){
		Shelves.shelves.push({name:name,titles:[]});
		this.publish(Shelves.shelves.length,'add');
		Shelves.AddtoShelfList(name);
		}
	},
	remove:function(name){
		var c=0;
		while(c<Shelves.shelves.length){
			if(Shelves.shelves[c].name==name){
				Shelves.shelves.splice(c,1);
				this.publish(Shelves.shelves.length,'remove');
				Shelves.RemovefromShelfList(name);
			}
			c++;
		}
				
	},
	AddtoShelfList:function(shelf){
			var o=document.createElement('option');
			o.text=shelf;
			ShelfList.add(o);
			ShelfList.selectedIndex=ShelfList.length-1;
			shelfname.value='';
			
	},
	RemovefromShelfList:function(shelf){
		var ridx=0;
		for(var c=0;c<ShelfList.length;c++){
			if(ShelfList.options[c].text==shelf){
				ridx=c;
			}
			shelfname.value='';
		}
		ShelfList.remove(ridx);
	},
	ShelfSelected:function(){
		var shelf=ShelfList.options[ShelfList.selectedIndex].text;
		shelfname.value=shelf;
		var titletext='';
		for(var c=0;c<Shelves.shelves.length;c++){
			if(Shelves.shelves[c].name==shelf){
				for(var b=0;b<Shelves.shelves[c].titles.length;b++){
					titletext=titletext+Shelves.shelves[c].titles[b]+',';
				}
			}
		}
		
		//Remove comma from last title
		titletext=titletext.substr(0,titletext.length-1);
		shelfbooks.value=titletext;
	},
	getBookShelf:function(title){
		for(var s=0;s<Shelves.shelves.length;s++){
			for (var t=0;t<Shelves.shelves[s].titles.length;t++){
				if(Shelves.shelves[s].titles[t]==title){
					return ' is on shelf '+Shelves.shelves[s].name;
				}
			}
		}
		return ' is Checked Out';
	},
	removefromshelf:function(title){
		var bidx=0;
		var sidx=0;
		for(var s=0;s<Shelves.shelves.length;s++){
			for (var t=0;t<Shelves.shelves[s].titles.length;t++){
				if(Shelves.shelves[s].titles[t]==title){
					bidx=t;
					sidx=s;
				}
			}
		}
		Shelves.shelves[sidx].titles.splice(bidx,1);
		Shelves.ShelfSelected();
	},
	ShelfListClick:function(){
		if(ShelfList.options.length<2 && ShelfList.options.length>0){
			Shelves.ShelfSelected();
		}
	}
	
};



makePublisher(Shelves);



var Library={
	shelfcount:0,
	addshelfcount:function(add){
		Library.shelfcount=add;
		numberofshelves.textContent=Library.shelfcount;
	},
	removeshelfcount:function(remove){
		Library.shelfcount=remove;
		numberofshelves.textContent=Library.shelfcount;
	},
	titlelist:[],
	titleadded:function(add){
		//Add to library book list
		Library.titlelist.push({title:add});
		Library.AddtoBookList(add);
	},
	titleremoved:function(remove){
		var c=0;
		while(c<Library.titlelist.length){
			if(Library.titlelist[c].title==remove){
				Library.titlelist.splice(c,1);
			}
			c++;
		}
		Shelves.removefromshelf(remove);
		Library.RemovefromBookList(remove);
		bookstatus.textContent=remove+' Removed from Library';
		if(listofbooks.value.length>14){
			Library.outputtitlelist();
		}
	},
	outputtitlelist:function(){
		//Create library list output text
		var titlelisttxt='IN THE LIBRARY:';
		var c=0;
		while(c<Library.titlelist.length){
			titlelisttxt=titlelisttxt+Library.titlelist[c].title+',';
			c++;		
		}
		//remove last comma from library output text
		titlelisttxt=titlelisttxt.substr(0,titlelisttxt.length-1);
		//output text to element
		listofbooks.value=titlelisttxt;
	},
	AddtoBookList:function(Book){
			var o=document.createElement('option');
			o.text=Book;
			BookList.add(o);
			BookList.selectedIndex=BookList.length-1;
			booktitle.value='';
			
	},
	RemovefromBookList:function(Book){
		var ridx=0;
		for(var c=0;c<BookList.length;c++){
			if(BookList.options[c].text==Book){
				ridx=c;
			}
			booktitle.value='';
		}
		BookList.remove(ridx);
	},
	BookSelected:function(){
		var title=BookList.options[BookList.selectedIndex].text;
		var shelf=Shelves.getBookShelf(title);
		bookstatus.textContent=title+shelf;
	},
	BookListClick:function(){
		if (BookList.options.length<2 && BookList.options.length>0){
			Library.BookSelected();
		}
	}
};



Shelves.subscribe(Library.addshelfcount,'add');
Shelves.subscribe(Library.removeshelfcount,'remove');
Books.subscribe(Library.titleadded,'add');
Books.subscribe(Library.titleremoved,'remove');



//UI
var numshellabel=document.createElement('Label');
numshellabel.textContent='Number of Library Shelves:';
document.body.appendChild(numshellabel);

var numberofshelves=document.createElement('Label');
numberofshelves.textContent='0';
document.body.appendChild(numberofshelves);

var br0=document.createElement('BR');
document.body.appendChild(br0);

var shelfname=document.createElement('INPUT');
shelfname.type='text';
document.body.appendChild(shelfname);


var addshelf=document.createElement('Button');
var astext=document.createTextNode('AddShelf');
addshelf.appendChild(astext);
addshelf.onclick=function(){Shelves.add(shelfname.value);};
document.body.appendChild(addshelf);

var removeshelf=document.createElement('Button');
var rstext=document.createTextNode('RemoveShelf');
removeshelf.appendChild(rstext);
removeshelf.onclick=function(){Shelves.remove(shelfname.value);};
document.body.appendChild(removeshelf);

var br1=document.createElement('BR');
document.body.appendChild(br1);

var shelfbookslbl=document.createElement('Label');
shelfbookslbl.textContent='Books on Shelf';
document.body.appendChild(shelfbookslbl);

var br2=document.createElement('BR');
document.body.appendChild(br2);

var shelfbooks=document.createElement('TextArea');
shelfbooks.cols=75;
document.body.appendChild(shelfbooks);

var br3=document.createElement('BR');
document.body.appendChild(br3);

var booktitle=document.createElement('INPUT');
booktitle.type='text';
booktitle.size=75;
document.body.appendChild(booktitle);

var addtitle=document.createElement('Button');
var attext=document.createTextNode('AddBook');
addtitle.appendChild(attext);
addtitle.onclick=function(){Books.add(booktitle.value);};
document.body.appendChild(addtitle);

var br4=document.createElement('BR');
document.body.appendChild(br4);

var bookstatus=document.createElement('LABEL');
bookstatus.textContent='Book Status';
document.body.appendChild(bookstatus);

var br5=document.createElement('BR');
document.body.appendChild(br5);

var ShelfList=document.createElement('Select');
ShelfList.onchange=function(){Shelves.ShelfSelected();};
ShelfList.onclick=function(){Shelves.ShelfListClick();};
document.body.appendChild(ShelfList);

var BookList=document.createElement('Select');
BookList.onchange=function(){Library.BookSelected();};
BookList.onclick=function(){Library.BookListClick();};
document.body.appendChild(BookList);

var checkin=document.createElement('Button');
var citext=document.createTextNode('CheckIn');
checkin.appendChild(citext);
checkin.onclick=function(){Books.enshelf(ShelfList.options[ShelfList.selectedIndex].text,BookList.options[BookList.selectedIndex].text);};
document.body.appendChild(checkin);

var checkout=document.createElement('Button');
var cotext=document.createTextNode('CheckOut');
checkout.appendChild(cotext);
checkout.onclick=function(){Books.unshelf(BookList.options[BookList.selectedIndex].text);};
document.body.appendChild(checkout);

var removetitle=document.createElement('Button');
var rttext=document.createTextNode('RemoveBook');
removetitle.appendChild(rttext);
removetitle.onclick=function(){Books.remove(BookList.options[BookList.selectedIndex].text);};
document.body.appendChild(removetitle);

var br6=document.createElement('BR');
document.body.appendChild(br6);

var showtitles=document.createElement('Button');
var showtext=document.createTextNode('ShowAllLibraryBooks');
showtitles.appendChild(showtext);
showtitles.onclick=function(){Library.outputtitlelist();};
document.body.appendChild(showtitles);

var br5=document.createElement('BR');
document.body.appendChild(br5);

var listofbooks=document.createElement('TextArea');
listofbooks.cols=75;
listofbooks.rows=15;
document.body.appendChild(listofbooks);



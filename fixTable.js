(function(window,document){
  var FixTable = function(query,length){
    if(!(this instanceof FixTable))return new FixTable(query,length);
    this.length=length||1;
    console.log(this.length);
    this.targetDom=(function(){
      if(typeof query ==='string'){
        return document.querySelector(query);
      }else if(query[0]){
        return query[0];
      }else{
        return query;
      }
    })();
    this.init();
  };
  FixTable.prototype = {
    getStyle:function(obj,name){
      if(obj.currentStyle){
        return obj.currentStyle[name]; /*仅支持IE*/
      }else{
        return getComputedStyle(obj,false)[name]; /*w3c 标准*/
        //兼容IE和火狐  return window.getComputedStyle.getPropertyValue(name);   
      }
    },
    init:function(){
      this.createFixLeftTable();
      this.createFixTopTable();
      this.setStyle();
      this.event();
      if(this.timer)
        clearTimeout(this.timer);
      var _this=this;
      this.timer=setTimeout(function(){
        _this.resize();
      },0);
    },
    createFixTopTable:function(){
      var targetDom=this.targetDom;
      var topDom=targetDom.cloneNode();
      var topDomThead=targetDom.children[0].cloneNode(true);
      topDom.appendChild(topDomThead);
      this.topDom=topDom;
      this.parentDom=this.targetDom.parentNode;
    },
    createFixLeftTable:function(){
      var leftDomThead=this.targetDom.children[0].cloneNode();
      var theadC=this.targetDom.children[0].cloneNode(true).children;
      var length=this.length<theadC[0].children.length?this.length:theadC[0].children.length;
      for(var i=0,l=theadC.length;i<l;i++){
        var tr=theadC[i].cloneNode();
        if(colspan){
          length=length+colspan-1;
        }

        for(var j=0;j<length;j++){
          tr.appendChild(this.targetDom.children[0].cloneNode(true).children[i].children[j]);
          var colspan=parseInt(this.targetDom.children[0].children[i].children[j].getAttribute("colspan"));
          var rowspan=parseInt(this.targetDom.children[0].children[i].children[j].getAttribute("rowspan"));
        }
        if(rowspan){
          i=i+rowspan-1;
        }
        leftDomThead.appendChild(tr);
      }
      var topDomTbody=this.targetDom.children[1].cloneNode();
      var tbodyC=this.targetDom.children[1].cloneNode(true).children;
      for(var i=0,l=tbodyC.length;i<l;i++){
        var tr=tbodyC[i].cloneNode();
        for(var j=0;j<length;j++){
          tr.appendChild(this.targetDom.children[1].cloneNode(true).children[i].children[j]);
        }
        topDomTbody.appendChild(tr);
      }
      var leftDom=this.targetDom.cloneNode();
      var firstDom=this.targetDom.cloneNode();
      leftDom.appendChild(leftDomThead.cloneNode(true));
      firstDom.appendChild(leftDomThead.cloneNode(true));
      leftDom.appendChild(topDomTbody);
      this.leftDom=leftDom;
      this.firstDom=firstDom;
    },
    setStyle:function(){
      this.topDom.style.zIndex=100;
      this.leftDom.style.zIndex=100;
      this.firstDom.style.zIndex=100;
      this.topDom.style.position='absolute';
      this.topDom.id='';
      // this.topDom.style.display='none';//ok
      this.leftDom.style.position='absolute';
      this.leftDom.id='';
      // this.leftDom.style.display='none';//ok
      this.firstDom.style.position='absolute';
      this.firstDom.id='';
      // this.firstDom.style.display='none';//ok
      this.targetDom.parentNode.style.position='relative';
      this.parentDom.insertBefore(this.leftDom,this.targetDom);
      this.parentDom.insertBefore(this.topDom,this.targetDom);
      this.parentDom.insertBefore(this.firstDom,this.targetDom);
    },
    event:function(){
      var _this = this;
      var scrollTop=_this.targetDom.parentNode.scrollTop+'px';
      var scrollLeft=_this.targetDom.parentNode.scrollLeft+'px';
      this.targetDom.parentNode.addEventListener("scroll",function(){
        var newScrollTop=_this.targetDom.parentNode.scrollTop;
        var newScrollLeft=_this.targetDom.parentNode.scrollLeft;
        if(scrollTop!=newScrollTop+'px'){
          scrollTop=newScrollTop+'px';
          _this.topDom.style.top=newScrollTop+'px';
          _this.firstDom.style.top=newScrollTop+'px';
        }else{
          scrollLeft=newScrollLeft+'px';
          _this.leftDom.style.left=newScrollLeft+'px';
          _this.firstDom.style.left=newScrollLeft+'px';
        }
      },false);
      window.addEventListener("resize",function(){
        if(_this.timer)
          clearTimeout(_this.timer);
        _this.timer=setTimeout(function(){
          _this.resize();
        },0);
      },false);
    },
    resize:function(){
      var _this=this;
      var setWidth={
        top:function(){
          var targetDom=_this.targetDom;
          var topDomTheadTr=_this.topDom.children[0].children;

          for(var i=0,l=topDomTheadTr.length;i<l;i++){
            for(var j=0,k=topDomTheadTr[i].children.length;j<k;j++){
              var width=_this.getStyle(_this.targetDom.children[0].children[i].children[j],'width');
              var height=_this.getStyle(_this.targetDom.children[0].children[i].children[j],'height');
              topDomTheadTr[i].children[j].style.width=width;
              topDomTheadTr[i].children[j].style.height=height;
              if(leftDomTd=_this.leftDom.children[0].children[i]){
                var leftDomTd=_this.leftDom.children[0].children[i].children[j];
                if(leftDomTd){
                  leftDomTd.style.width=width;
                  leftDomTd.style.height=height;
                }
              }
              if(_this.firstDom.children[0].children[i]){
                var firstDomTd=_this.firstDom.children[0].children[i].children[j];
                if(firstDomTd){
                  firstDomTd.style.width=width;
                  firstDomTd.style.height=height;
                }
              }
            }
          }
          _this.topDom.style.width=_this.getStyle(targetDom,'width');
        },
        leftAndFirst:function(){
          var totalWidth=0;
          var theadC=_this.leftDom.children[0].children;
          for(var i=0,l=theadC.length;i<l;i++){
            if(colspan){
              length=length+colspan-1;
            }

            for(var j=0;j<length;j++){
              var colspan=parseInt(_this.targetDom.children[0].cloneNode(true).children[i].children[j].getAttribute("colspan"));

              if(!colspan||colspan==1){
                var obj=_this.targetDom.children[0].children[i].children[j];
                var width=_this.getStyle(obj,'width');
                totalWidth+=parseInt(width);
              }
            }
          }

          _this.leftDom.style.width=totalWidth+'px';
          _this.firstDom.style.width=totalWidth+'px';
        },
        body:function(){
          var targetDom=_this.targetDom;
          var leftDomTbodyTr=_this.leftDom.children[1].children;

          for(var i=0,l=leftDomTbodyTr.length;i<l;i++){
            for(var j=0,k=leftDomTbodyTr[i].children.length;j<k;j++){
              var height=_this.getStyle(_this.targetDom.children[1].children[i].children[j],'height');
                var leftDomTd=_this.leftDom.children[1].children[i].children[j];
                  leftDomTd.style.height=height;
            }
          }
        }
      }
      setWidth.top();
      setWidth.leftAndFirst();
      setWidth.body();
    }
  };
  // 暴露方法
  window.FixTable = FixTable;
}(window,document));
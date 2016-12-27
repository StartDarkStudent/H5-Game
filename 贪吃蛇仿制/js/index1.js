window.onload = function (){
	// 游戏区域
	var wrap = document.getElementsByClassName("wrap")[0];
	//本体
	var uls = document.getElementsByClassName("sbody")[0];
	//头部
	var hand = document.getElementsByClassName("hand")[0];
	//食物
	var food = document.getElementsByClassName("food")[0];
	//身体 
	var lis = document.getElementsByTagName("li");
	//分数
	var fens = document.getElementById("fens");

	//头部运动
	var handT = false;//true上false下
	var handL = false;//true左false右

	//控制定时器频率
	var frequency = 200;

	//键盘方向标志
	var handCt = false;//true被按 false没有

	var handTop = 180;
	var handLeft = 180;//初始值
	var stime;//定时器

	//本体和框架的高度

	var handW = 30;
	var handH = 30;

	var wrapW = 900;
	var wrapH = 600;

	hand.style.top= handTop + "px";
	hand.style.left = handLeft + 'px';

	//食物闪动
	setInterval(function(){
		if(food.style.opacity == "1"){
			food.style.opacity = "0.3";
		}else {
			food.style.opacity= "1";
		}
	},600)


	//存储身体各位置数组
	var arrL = [];
	var arrT = [];

	function handMove() {
		stime = setInterval(function(){
			foodPink();
			//将刷新函数提前 
			for(var i = lis.length - 1;i > 0; i--){
				lis[i].style.left = lis[i - 1].style.left;
				lis[i].style.top = lis[i-1].style.top;
			}

			//判断键盘上下按键
			if(handCt){

				if(handT){
					if(handTop <= 0){
						handTop = wrapH - handH;
					}else {
						handTop -= 30;
					}
				}else {
					if(handTop >= (wrapH -handH)){
						handTop = 0;
					}else{
						handTop += 30;
					}
				}
				hand.style.top = handTop + "px";
			}else{

				if(handL) {
					if(handLeft <= 0){
						handLeft = wrapW -handW;
					}{
						handLeft -= 30;
					}
				}else {
					if(handLeft >= (wrapW - handW)){
						handLeft = 0;
					}else{
						handLeft += 30;
					}
				}
				hand.style.left = handLeft + "px";
			}

			arrL = [];
			arrT = [];
			for(var i = 0; i < lis.length; i ++){
				arrL.push(lis[i].style.left);
				arrT.push(lis[i].style.top);
			}

			zisha();

		},frequency)
	}

	//判断是否撞到自己
	function zisha(){
		//数组与头部重叠
		for(var i = 1; i< arrT.length;i ++){
			if(arrT[0] == arrT[i] && arrL[0] == arrL[i]){
				fens.innerHTML = "游戏结束：" + fen + "分<br/>点击任意键返回"
				uls.style.zIndex = "0";

				fen = 0;
				fens.style.fontSize = "100px";
				fens.style.lineHeight = "120px";
				clearInterval(stime);
				uls.style.opacity = "0.2";

				document.addEventListener("keydown",function(){
					location.reload();
				},false)
			}
		}
	}

	//食物产生的随机位置
	function getRandom(min,max){
		return Math.floor(Math.random()* (max-min)+ min);
	}
	function foods(){
		var foodRandomT = getRandom(0,20);
		var foodRandomL = getRandom(0,30);

		//食物出现在身体上
		for(var i = 0; i < arrT.length; i++) {
			while(foodRandomT == arrT[i] && foodRandomL == arrL[i]){
				foodRandomL = getRandom(0,20);
				foodRandomT = getRandom(0,30);
				i = 0;
			}
		}
		food.style.top = foodRandomT*30 + "px";
		food.style.left = foodRandomL*30 + "px";
	}
	foods();

	//碰撞到边框
	function sbodyPingk(){
		//碰到上下检测
		if(handTop <= 0){
			handTop = wrapH -handH;
		}else if(handTOp >= (wrapH -handH)){
			handTop = 0;
		}
		//碰到左右检测
		if(handLeft <= 0){
			handLeft = wrapW - handW;
		}else if(handLeft >= (wrapW -handW)){
			handLeft = 0;
		}
	}

	//碰到食物
	var fen = 0;

	function foodPink(){
		var foodW = 30;
		var foodH = 30;
		var foodLeft = food.offsetLeft;
		var foodTop = food.offsetTop;
		var foodRight = foodLeft + foodW;
		var foodBottom = foodTop + foodH;

		if(foodLeft == handLeft && handTop == foodTop){
			shuaxin();
		}
	}

	function shuaxin(){
		foods();

		if(fens.style.fontSize == "300px"){
			fens.style.fontSize = "50px";
		}else {
			fens.style.fontSize = "300px";
		}
		fen += 1;
		fens.innerHTML =fen;
		//增加一个
		var newLi = document.createElement("li");
		uls.appendChild(newLi);
	}

	//按键2次不触发
	var TkeyCode = true;
	var TkeyOld = 0;

	//对键盘检测
	document.addEventListener("keydown",function(e){
		uls.style.opacity = "1";
		fens.style.zIndex = "0";
		fens.innerHTML = fen;
		fens.style.fontSize = "300px";

		var e = e|| window.event;
		var keyCode = e.keyCode || e.which;

		if(TkeyOld == keyCode){
			TkeyCode = false;
		}else{
			TkeyCode = true;
		}
		if(TkeyCode == true){
			//第二次无效
			TkeyOld = keyCode;
			//重置定时器 
			clearInterval(stime);
			//加速
			if(e.shiftKey){
				frequency -= 40;
				if(frequency<40){
					frequency = 60;

				}
				alert(frequency);
			}

			if(e.ctrlKey){
				frequency += 40;
				if(frequency>300){
					frequency = 280;
				}
				alert(frequency);
			}
			//运动开始
			handMove();
			//重新开始
			if(e.altKey){
				location.reload();
			}
			//向左右移动时，左右键无效
			if(handCt == false){
				switch(keyCode){
					case 40://下
					handCt = true;
					handT = false;
					break;

					case 38://上
					handCt = true;
					handT = true;
					break;
				}
			}else{
				switch(keyCode){
					case 37://左
					handCt = false;
					handL =true;
					break;

					case 39://右
					handCt = false;
					handL =false;
					break;
				}
			}
		}
	},false)

};
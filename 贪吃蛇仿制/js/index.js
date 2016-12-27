window.onload= function(){
	// 游戏区域
	var wrap = document.getElementsByClassName("wrap")[0];
	// 本体
	var uls = document.getElementsByClassName("sbody")[0];
	// 头部
	var hand = document.getElementsByClassName("hand")[0];
	// 食物
	var food = document.getElementsByClassName("food")[0];
	// 身体
	var lis = document.getElementsByTagName("li");
	// 分数
	var fens = document.getElementById("fens");

	// 头部运动，判断方向
	var handT = false;//true上false下
	var handL = false;//true左false右

	//控制定时器频率
	var frequency = 200;

	// 键盘方向标志
	var handCt = false;//上下按了 左右不按

	var handTop = 180;
	var handLeft = 180;//初始值

	var stime;//不知道是什么

	// 本体和框架额宽高
	var handW = 30;
	var handH = 30;
	var wrapW = 900;
	var wrapH = 600;

	hand.style.top = handTop + "px";
	hand.style.left = handLeft + "px";


	//食物闪动函数
	setInterval(function(){
		if(food.style.opacity == "1"){
			food.style.opacity = "0.3";
		} else {
			food.style.opacity = "1";
		}
			
	},600)



	//储存身体的数组

	var arrL = [];
	var arrT = [];

	// 头部运动函数
	function handMove(){
		stime = setInterval(function(){
		foodPingk();
			//设置sbody的位置函数需要写在hand的位置获得之前，否则，hand的位置会先跑到前面去
			for(var i = lis.length - 1; i >0; i--){
				lis[i].style.left = lis[i-1].style.left;
				lis[i].style.top = lis[i-1].style.top;
			}

			// 判断键盘按键
			if(handCt){
				if(handT){
					if(handTop <= 0){
						handTop = wrapH -handH;
					}else{
						handTop -= 30;
					}
				}else {
					if(handTop >= (wrapH - handH)){
						handTop = 0;
					}else{
						handTop += 30;
					}
				}
				hand.style.top = handTop + "px";
			} else{

				if(handL){
					if(handLeft <= 0){
						handLeft =wrapW -handW;
					}{
						handLeft -= 30;
					}
				} else{
					if(handLeft >= (wrapW -handW)){
						handLeft = 0;
					}else{
						handLeft += 30;
					}
				}

				hand.style.left = handLeft + "px";
			}

			//存储位置数组
			arrL = [];
			arrT = [];
			for(var i = 0; i< lis.length; i++){
				arrL.push(lis[i].style.left);
				arrT.push(lis[i].style.top);

			}

			zisha();
		},frequency)
	}

	//判断是否撞到自己
	function zisha(){
		//数组头部中arrL或者arrT相同就是叠加
		for(var i =1; i < arrT.length; i++){
			if(arrT[0] == arrT[i] && arrL[0] == arrL[i]){
				fens.innerHTML = "游戏结束:" + fen + "分<br/>点击任意键返回";
				uls.style.zIndex = "0";

				fen = 0;
				fens.style.fontSize = "100px";
				fens.style.lineHeight = "120px";
				clearInterval(stime);
				uls.style.opacity = "0.2";

				document.addEventListener("keydown",function(){
					//任意键位返回
					location.reload();
				},false)
			}
		}
	}


	//食物产生的随机位置
	function getRandom(min,max){
		return Math.floor(Math.random() * (max -min)+ min);
	}
	//宽度30个，高度20个
	function foods(){
		var foodRandomT = getRandom(0,20);
		var foodRandomL = getRandom(0,30);

		//如果食物出现在身体上
		for(var i = 0; i<arrT.length; i ++){
			while(foodRandomT == arrT[i] && foodRandomL == arrL[i]){
				foodRandomL = getRandom(0,20);
				foodRandomT = getRandom(0,30);
				i = 0;
			}
		}
		food.style.top = foodRandomT *30 + "px";
		food.style.left = foodRandomL *30 + "px";
	}
	foods();

	//碰撞到边框
	function sbodyPingk(){
		//碰到上下检测
		if(handTop <= 0){
			handTop = wrapH - handH;
		}else if(handTop >= (wrapH -handH)){

			handTop = 0;
		}
		//碰到左右检测
		if(handLeft <= 0){
			handLeft = wrapW - handW;
		}else if(handLeft >= (wrapW -handW)){
			handLeft = 0;
		}
	}

	//碰撞到食物
	var fen = 0;

	function foodPingk() {
		var foodW = 30;
		var foodH = 30;
		var foodLeft = food.offsetLeft;
		var foodTop = food.offsetTop;
		var foodRigtht = foodLeft + foodW;
		var foodBottom = foodTop + foodW;
		//完全重叠

		if(foodLeft == handLeft && handTop == foodTop){
			shuaxin();
		}
	}

	// 刷新的函数
	function shuaxin(){
		foods();

		if(fens.style.fontSize == "300px"){
			fens.style.fontSize = "50px";
		}else {
			fens.style.fontSize = "300px";
		}

		fen += 1;
		fens.innerHTML = fen;

		var newLi = document.createElement("li");
		uls.appendChild(newLi);
	}

	//同样的键按两次不触发
	var TkeyCode = true;
	var TkeyOld = 0;

	//-----检测键盘
	document.addEventListener("keydown", function(e) {
		uls.style.opacity = "1";
		fens.style.zIndex = "0";
		fens.innerHTML = fen;
		fens.style.fontSize = "300px";

		var e = e || window.event;
		var keyCode = e.keyCode || e.which;

		if(TkeyOld == keyCode) {
			TkeyCode = false;
		} else {
			TkeyCode = true;
		}
		if(TkeyCode == true) {
			TkeyOld = keyCode;
			//每次进入重置定时器
			clearInterval(stime);
			//加速
			if(e.shiftKey) {
				frequency -= 40;
				if(frequency < 40) {
					frequency = 60;
				}
				//				alert(seep);
			}
			//开始运动
			handMove();
			//重新开始，刷新页面
			if(e.altKey) {
				location.reload();
			}
			//如果正在向左或右运动，左右键无效,反之同样
			if(handCt == false) {
				switch(keyCode) {

					case 40: //下
						handCt = true;
						handT = false;
						break;
					case 38: //上
						handCt = true;
						handT = true;
						break;
				}
			} else {
				switch(keyCode) {
					case 37: //左
						handCt = false;
						handL = true;
						break;
					case 39: //右
						handCt = false;
						handL = false;
						break;
				}
			}
		}
	}, false)


};
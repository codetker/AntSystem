// 蚁群算法解决TSP旅行商问题
/*
n 城市规模
m 蚂蚁数量在n^0.5和n/2之间
NC 蚂蚁行走轮数
a =1~5信息素重要程度的参数
b =1~5启发因子重要程度的参数
p =0.7信息素蒸发系数
Q =100信息素增加强度系数
C n个城市坐标，n*2数组
*/
//包装成一个函数方便调用
function AntSystem(C){ //传入城市坐标矩阵即可

	var p=0.7;  //参考资料上得到，同m的值

	var n=C.length;     //城市数目
	// var n1=Math.floor(Math.sqrt(n));//ceil,round,floor
	// var n2=Math.floor(n/2);
	// var m=Math.round(Math.random()*(n2-n1)+n1);  //蚂蚁只数
	var m=getAntNum(n);
	var NC=1;
	var NC_max=60;      //最大执行次数   
	var D;        //城市之间的距离
	D =new2Arr(D,n);
	var E;        //每只蚂蚁的信息素矩阵
	E=new2Arr(E,n);
	var T;        //每轮的信息素矩阵
	T=new2Arr(T,n);
	
	// 计算两个城市之间的距离，考虑对称TSP
	for(var i=0;i<n;i++){
		for(var j=i+1;j<n;j++){
			D[i][j]=Math.sqrt( (C[i][0]-C[j][0])*(C[i][0]-C[j][0])+(C[i][1]-C[j][1])*(C[i][1]-C[j][1]) );
			D[j][i]=D[i][j];
		}
		D[i][i]=0; 
	}

    //计算初始的信息素矩阵
	for(var i=0;i<n;i++){
		for(var j=i+1;j<n;j++){
			E[i][j]=1/(n*(n-1));  //初始假定总的信息素为1，每条路上的启发因子相同。(此时蚂蚁寻找下一路径完全随机)
			E[j][i]=E[i][j];
		}
		E[i][i]=0;
	}


	var sMin,min;
	var last=10e15;             //记录最终的最短路径,初始的给一个极大值

	var lastRoute=new Array();
	lastRoute[0]=new Array();

	// T=E; //T为信息素矩阵,由于E和T均为Array类型，所以直接写等号其实是指向同一个对象。这里应该深复制。http://www.cnblogs.com/Loofah/archive/2012/03/23/2413665.html
	extend(T,E);



	//算法开始
	while(NC<=NC_max){ //外循环，蚂蚁爬行轮数NC限制
		
		//var road=[ [[0,1]],[[0,1]],[[0,1]],[[0,1]],[[0,1]] ]; //最多5只蚂蚁
		// var allRoad=new Array();
		// var minRoad;
		//部分变量初始化
		var road=new Array(); //记录这组蚂蚁的行走路径，按照蚂蚁编号;三维数组，最外一层记录蚂蚁的编号;每次刷新
		for(var k=0;k<m;k++ ){
			road.push([[0,1]]);
		}
		var sAll=new Array();  //没有赋初始值的情况下会被默认当做string处理
		for (var i=0; i <m ; i++) {
			sAll[i]=0;
		}

		for(var i=0;i<m;i++){ //内循环，对于每一只蚂蚁,假设均从城市0出发，最后回到城市0
			//部分变量初始化
			extend(E,T);
			var route=new Array();
			for(var j=0;j<n;j++){  //蚂蚁需要访问的城市列表，包括自身(必须为最后到达)，以形成环
				route[j]=j;
			}
			var pre=0;
			var next;

			while(all(route)!=0){  //遍历完一次所有城市
				next=nextStep(pre,E); //[0,next]为此时选择的路线
				road[i].push([pre,next]);//调用数组的栈方法
				route[next]=0;  //从要访问的城市列表里去掉已访问城市,判断倒数第二个即为sum(route)=0
				//修改E，保证next不会被二次访问到，E(:,next)= 0,则计算sum(E(a,:))时不计算到next城市的，而且也不可能被分在这个区间
				for(var k=0;k<n;k++){
					E[k][next]=0;
				}
				pre=next;
			}
			//加上回到原点的
			next=0;
			road[i].push([pre,next]);  //加上到原点的一项
			road[i].shift();          //去掉自己初始添加的第一项
		}

		//根据这一轮蚂蚁的行走修改信息素信息,提取road里面存储的路径,得到最小路径，并更新相关的信息素
		for(var k=0;k<m;k++){ //蚂蚁编号
			for(var k2=0;k2<n;k2++){  //移动编号
				sAll[k]+= D[ road[k][k2][0] ][ road[k][k2][1] ] ;//每次移动走过的长度
			}
		}
		var ret=minAll(sAll);
		// [min,sMin]=minAll(sAll);
		min=ret[0];
		sMin=ret[1];

		if(last>sMin){
			last=sMin;
			lastRoute=road[min];
		} //保证是到目前为止最短的路径

		//更新目前最短路径的信息素信息，加大在附近搜索的概率。挥发+增强
		for(var k=0;k<n;k++){
			T[ road[min][k][0] ][ road[min][k][1] ]=T[ road[min][k][0] ][ road[min][k][1] ]*(1-p)+p*(1/sMin);
		}
		//更新不在最短路径上的信息素信息，仅挥发
		for(var k=0;k<n;k++){
			for( k2=0;k2<n;k2++){
				if( k2!= road[min][k][1] ){
					T[k][k2]=T[k][k2]*(1-p);
				}
			}
		}
		NC++;

	}
	var retTmp=new Array();
	retTmp.push(last);
	retTmp.push(lastRoute);
	return retTmp;
	// return [last,lastRoute]; //返回得到的最佳路径的过程和长度
}
	


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
// $(document).ready(function() {
	// 变量初始化
	var n=10;
	var C=[
	[0,0],
	[0,1],
	[0,2],
	[1,0],
	[1,1],
	[1,2],
	[1,3],
	[2,0],
	[2,1],
	[2,2]
	];
	var n1=Math.floor(Math.sqrt(n));//ceil,round,floor
	var n2=Math.floor(n/2);
	var m=Math.round(Math.random()*(n2-n1)+n1);
	var NC=1;
	var NC_max=60;
	var a=2;
	var b=2;
	var p=0.7;
	var Q=100;
	var D=new Array();
	for(i1=0;i1<n;i1++){
		D[i1]=new Array();
	}

	// 计算两个城市之间的距离，考虑对称TSP
	for(i2=0;i2<n;i2++){
		for(j1=i2+1;j1<n;j1++){
			D[i2][j1]=Math.sqrt( (C[i2][0]-C[j1][0])*(C[i2][0]-C[j1][0])+(C[i2][1]-C[j1][1])*(C[i2][1]-C[j1][1]) );
			D[j1][i2]=D[i2][j1];
		}
		D[i2][i2]=1e-5;  //应该为0，但后面的启发因子要取倒数，则用一个较小的数代替
	}

	var E=new Array(); //启发因子,和信息素相关
	for(i3=0;i3<n;i3++){
		E[i3]=new Array();
	}
	for(i4=0;i4<n;i4++){
		for(j2=i4+1;j2<n;j2++){
			E[i4][j2]=1/(n*(n-1));  //初始假定总的信息素为1，每条路上的启发因子相同。(此时蚂蚁寻找下一路径完全随机)
			E[j2][i4]=E[i4][j2];
		}
		E[i4][i4]=0;
	}

	var T=new Array(); //每次的信息素矩阵
	for(i5=0;i5<n;i5++){
		T[i5]=new Array();
	}

	var i,j,k,k2,k3,k4,sMin,min;
	var sAll=new Array(m);  //记录一轮的路径长度
	var last=10e15;//记录最终的最短路径
	var lastRoute=new Array();
	lastRoute[0]=new Array();
	for(k3=0;k3<m;k3++){
		sAll[k3]=0;  //初始化
	}
	// T=E; //T为信息素矩阵,由于E和T均为Array类型，所以直接写等号其实是指向同一个对象。这里应该深复制。http://www.cnblogs.com/Loofah/archive/2012/03/23/2413665.html
	extend(T,E);



	//算法开始
	while(NC<=NC_max){ //外循环，蚂蚁爬行轮数NC限制
		//var road=new Array(); //记录这组蚂蚁的行走路径，按照蚂蚁编号
		// road[0]=new Array();
		// road[0][0]=new Array(); //三维数组，最外一层记录蚂蚁的编号
		// road[0].shift();  //除掉空数组
		var road=[ [[0,1]],[[0,1]],[[0,1]],[[0,1]],[[0,1]] ]; //最多5只蚂蚁
		// var allRoad=new Array();
		// var minRoad;
		i=0;
		for(;i<m;i++){ //内循环，对于每一只蚂蚁,假设均从城市0出发，最后回到城市0
			extend(E,T);
			var route=new Array();
			for(j=0;j<n;j++){ //蚂蚁需要访问的城市列表，包括自身(必须为最后到达)，以形成环
				route[j]=j;
			}
			var pre=0;
			var next;
			while(all(route)!=0){  //遍历完一次所有城市
				next=nextStep(pre,E); //[0,next]为此时选择的路线
				road[i].push([pre,next]);//调用数组的栈方法
				route[next]=0;  //从要访问的城市列表里去掉已访问城市,判断倒数第二个即为sum(route)=0
				//修改E，保证next不会被二次访问到，E(:,next)= 0,则计算sum(E(a,:))时不计算到next城市的，而且也不可能被分在这个区间
				for(k=0;k<n;k++){
					E[k][next]=0;
				}
				pre=next;
			}
			//加上回到原点的
			next=0;
			road[i].push([pre,next]);  //加上到原点的一项
			road[i].shift();          //去掉自己添加的第一项
		}

		//根据这一轮蚂蚁的行走修改信息素信息,提取road里面存储的路径,得到最小路径，并更新相关的信息素
		for(kx=0;kx<m;kx++){ //蚂蚁编号
			for(k2=0;k2<n;k2++){  //移动编号
				sAll[kx]+= D[ road[kx][k2][0] ][ road[kx][k2][1] ] ;//每次移动走过的长度
			}
		}
		[min,sMin]=minAll(sAll);
		//更新目前最短路径的信息素信息，加大在附近搜索的概率
		for(k4=0;k4<n;k4++){
			T[ road[min][k4][0] ][ road[min][k4][1] ]=T[ road[min][k4][0] ][ road[min][k4][1] ]*p+(1-p)*(1/n);
		}
		if(last>sMin){
			last=sMin;
			lastRoute=road[min];
		}
		NC++;

	}
	function minAll(sAll){
		var l=sAll.length;
		var min;
		min=sAll[0];
		var i6;
		var temp;
		for(i6=0;i6<m;i6++){
			if(min>sAll[i6]){
				sMin=sAll[i6];
				temp=i6;
			}
		}
		return [temp,sMin];
	}

	function all(route){ //数组求和
		var s=0;
		var l=route.length;
		var i7;
		for(i7=0;i7<l;i7++){
			s+=route[i7];
		}
		return s;
	}

	function nextStep(x,E){ //用随机数判断蚂蚁下一步的去向,返回下一个城市的编号
		/*
		x为当前蚂蚁所在的城市
		E为当前信息素
		*/
		var kx1=Math.random();//取随机数,在0和1之间
		var s;  //x处蚂蚁到其它任一城市去的距离之和(到本地为0)
		var len; //其实可以作为参数传进来，但也可以自己从矩阵里获得
		var result=new Array();  //按比例每个分段,存在相等，则有两个数值相同;最后一个应该为1
		[s,len,result]=sum(x,E);
		for(i8=0;i8<len;i8++){
			if(result[i8]>kx1){
				return i8;   //查看在哪个区间，来确定蚂蚁的走向
				break;
			}
		}
		// 由随机数所在的区间来确定下一个城市
	}

	function sum(x,E){ //矩阵求和
		var temp=new Array();
		temp=E[x];
		var result=new Array();
		var len=temp.length;
		var i9;//保证全部为局部变量
		var j3;
		var s=0;
		for(i9=1;i9<len;i9++){
			s+=temp[i9];
		}
		for(j3=1;j3<len;j3++){
			if(j3==1){
				result[j3]=temp[j3]/s;
			}else{
				result[j3]=result[j3-1]+temp[j3]/s;
			}
		}
		return [s,len,result];  
		/*
		返回s:sum(E[x,:])
		返回len:返回m
		返回result: E[x,0]/s   E[x,0]/s+E[x,1]/s ....
		*/
  	}

  	function getType(o)
    {
        var _t;
        return ((_t = typeof(o)) == "object" ? o==null && "null" || Object.prototype.toString.call(o).slice(8,-1):_t).toLowerCase();
    }
    function extend(destination,source)
    {
        for(var p in source)
        {
            if(getType(source[p])=="array"||getType(source[p])=="object")
            {
                destination[p]=getType(source[p])=="array"?[]:{};
                arguments.callee(destination[p],source[p]);
            }
            else
            {
                destination[p]=source[p];
            }
        }
    }

// });


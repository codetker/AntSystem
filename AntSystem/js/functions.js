//为了构造上的简洁，将工具函数单独拿出来，放在最前面(不考虑加载占用的时间)

//为了便于审查，将工具函数放在前面
//一维数组求最小数
	function minAll(arr){
		var l=arr.length;
		var min=arr[0];
		var temp=0;
		var sMin=min;
		for(var i=0;i<l;i++){
			if(min>arr[i]){
				sMin=arr[i];
				temp=i;
			}
		}
		return [temp,sMin];
	}

//一位数组求和
	function all(arr){ //数组求和
		var s=0;
		var l=arr.length;
		for(var i=0;i<l;i++){
			s+=arr[i];
		}
		return s;
	}

//用当前所在城市确定下一座城市
	function nextStep(x,E){ //用随机数判断蚂蚁下一步的去向,返回下一个城市的编号
		/*
		x为当前蚂蚁所在的城市
		E为当前信息素
		*/
		var k=Math.random();//取随机数,在0和1之间;局部变量会覆盖外部全局变量
		var s;  //x处蚂蚁到其它任一城市去的距离之和(到本地为0)
		var l; //其实可以作为参数传进来，但也可以自己从矩阵里获得
		var result=new Array();  //按比例每个分段,存在相等，则有两个数值相同;最后一个应该为1
		[s,l,result]=sum(x,E);
		for(var i=0; i<l; i++){
			if(result[i]>k){
				return i;   //查看在哪个区间，来确定蚂蚁的走向
				break;
			}
		}
		// 由随机数所在的区间来确定下一个城市
	}

//配合nextStep矩阵求和
	function sum(x,E){ //矩阵求和
		var temp=E[x];
		var result=new Array();
		var len=temp.length;
		var s=0;
		for(var i=1;i<len;i++){
			s+=temp[i];
		}
		for(var j=1;j<len;j++){
			if(j==1){
				result[j]=temp[j]/s;
			}else{
				result[j]=result[j-1]+temp[j]/s;
			}
		}
		return [s,len,result];  
		/*
		返回s:sum(E[x,:])
		返回len:返回m
		返回result: E[x,0]/s   E[x,0]/s+E[x,1]/s ....
		*/
  	}
//新建x列二维数组，减少全局变量
	function new2Arr(arr,x){
		arr=new Array();
		for(var i=0;i<x;i++){
			arr[i]=new Array();
		}
		return arr;
	}

//通过城市数量得到最佳蚂蚁数量
	function getAntNum(x){
		var n1= Math.sqrt(x);//ceil,round,floor
	  	var n2= x/2;
	    return Math.round(Math.random()*(n2-n1)+n1);  //蚂蚁只数
	}


//js对象深复制
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
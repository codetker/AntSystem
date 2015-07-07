//配合jq执行输入和输出
$(document).ready(function(){
	// 变量初始化
	 // var C=[
	 // [0,0],
	 // [0,1],
	 // [0,2],
	 // [1,0],
	 // [1,1],
	 // [1,2],
	 // [1,3],
	 // [2,0],
	 // [2,1],
	 // [2,2]
	 // ];
	 var last;
	 var lastRoute;
	 var antNum;
	 // [last,lastRoute]=AntSystem(C);

	 $(".getNum").click(function(){
	  	antNum=parseInt($(".num").val());
	 	if(antNum!=antNum){
	 		$(".state").text("输入错误！不是一个数字!");
	 	}else if(antNum<3||antNum>100){
	 		$(".state").text("输入错误！n的大小不满足条件!");
	 	}else{
	 		$(".state").text("输入正确！请继续输入城市坐标矩阵!");
	 		setTimeout(function(){
	 			$(".dataInput").fadeIn();
	 			var temp="<li><input type='number' class='martrixData' name='martrixData' /><input type='number' class='martrixData' name='martrixData' /></li>";
	 			for(var i=0;i<antNum;i++){
	 				$(".MartrixInput ul").append(" 城市 "+i+temp);
	 			}
	 		},100);
	 	}
	 });

	 $(".getMartrix").click(function(){
	 	$(".dataOutput").fadeIn();
	 	var C;
	 	C=new2Arr(C,antNum);
	 	var obj=$(".MartrixInput ul li");
	 	for(var i=0;i<antNum;i++){
	 		C[i][0]=$(obj).eq(i).children().eq(0).val();
	 		C[i][1]=$(obj).eq(i).children().eq(1).val();
	 	}
	 	[last,lastRoute]=AntSystem(C);
	 	$(".shortestL").text(last);
	 	var out=$(".route");
	 	for(var i=0;i<antNum;i++){
	 		$(out).append( lastRoute[i][0]+" -> "+lastRoute[i][1]+"</br>" );
	 	}
	 });
});
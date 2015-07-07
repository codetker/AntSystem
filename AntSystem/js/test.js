//测试内部变量和外部变量
/*var i;
var B=[1,2,3];
for(i=0;i<5;i++){
	a=sum(B);
}
function sum (B) {
	var sum=0;
	for(var i=0;i<B.length;i++){
		sum+=B[i];
	} //由于js没有块级作用于，因此这样写i的时候其实是全局变量
	return sum;
}*/

//测试传入变量对实际变量的影响
var N=3;
make(N);
function make(N){
	N=5;    //作为传入参数N，相当于申明了局部变量 var N=argument[0];则不会对外部N全局变量有影响
	return 7;
}
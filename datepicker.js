(function(){
	var datepicker = {};
	var wrapperElem;
	var resArr;

	datepicker.getMonthData = function(year,month){

		//month参数的正确范围为：1-12，符合用户输入的习惯
		
		var dateArr = [];

		//修正传入的year和month
		if(month == 0){
			month = 12;
			year--;
		}

		if(month == 13){
			month = 1;
			year++;
		}

		//	本月第一天数据
		var firstDay = new Date(year,month-1,1);
		//本月第一天是星期几
		var firstDayOfWeekDay = firstDay.getDay();
		//本月最后一天数据
		var lastDay = new Date(year,month,0);
		//本月最后一天日期
		var lastDayOfMonth = lastDay.getDate();

		//上一个月的最后一天的完整日期
		var lastDayOfLastMonth = new Date(year,month-1,0);
		//上一个月的最后一天的日期数字
		var lastDateOfLastMonth = lastDayOfLastMonth.getDate();		

		//第一行要显示多少个上个月的日期
		var prevMonthDayCount = firstDayOfWeekDay;//1		

		for(var i=0;i<7*6;i++){

			/*
			以2019年5月份数据为例			 
			i:0,1,2,3,4,5,6,7,8,9,10,11,12,13，14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41
			目标数据：28,29,30,1,2,3,4,5,6,7,8,9,10,11,12,13，14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31，1,2,3,4,5,6,7,8,9,10,11
			date:-2,-1,0,1,2,3,4,5,6,7,8,9,10,11,12,13，14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39
			 */
			
			var date = i + 1 - prevMonthDayCount;	

			var showDate = date;

			var thisYear = 	year;
			var thisMonth = month;
			
			if(date <= 0){
				//上个月的数据
				showDate = lastDateOfLastMonth + date;	
				thisMonth--;		
			}else if(date > lastDayOfMonth){
				//下个月的数据
				//console.log("1111112");
				showDate = date - lastDayOfMonth;
				thisMonth++;				
			}

			if(thisMonth==0){
				thisMonth = 12;
				thisYear--;
			}

			if(thisMonth==13){
				thisMonth = 1;
				thisYear++;
			}
			
			// {year:2019,month:3,showDate:31}
			dateArr.push({
				year:thisYear,
				month:thisMonth,
				showDate:showDate
			});
		}

		return {
			year:year,
			month:month,
			dateArr:dateArr
		};		
	};

	datepicker.render = function(year,month){
		//获取数据
		resArr = datepicker.getMonthData(year,month);
		
		//创建class="ui-datepicker-wrapper"的元素 getElementsByClassName 在IE8及以下不支持
		wrapperElem = document.getElementsByClassName("ui-datepicker-wrapper")[0];

		if(!wrapperElem){
			//没有这个class="ui-datepicker-wrapper"的元素，创建
			wrapperElem = document.createElement("div");
			wrapperElem.className = "ui-datepicker-wrapper";
			document.body.appendChild(wrapperElem);
		}
		
		var html = '<div class="ui-datepicker-header">'+
			'<a href="javascript:;" class="ui-datepicker-btn ui-datepicker-prev-btn">&lt;</a>'+
			'<a href="javascript:;" class="ui-datepicker-btn ui-datepicker-next-btn">&gt;</a>'+
			'<span class="ui-datepicker-curr-month">'+ resArr.year +'年'+ resArr.month +'月</span>'+
		'</div>'+
		'<div class="ui-datepicker-body">'+
			'<table>'+
				'<thead>'+
					'<tr>'+
						'<th>日</th>'+
						'<th>一</th>'+
						'<th>二</th>'+
						'<th>三</th>'+
						'<th>四</th>'+
						'<th>五</th>'+
						'<th>六</th>'+
					'</tr>'+
				'</thead>'+
				'<tbody>';
				for(var i=0;i<resArr.dateArr.length;i++){
					/*
						0,1,2,3,4,5,6
						7,8,9,10,11,12,13
						14,15,16,17,18,19,20
						21,22,23,24,25,26,27
						28,29,30,31,32,33,34
						35,36,37,38,39,40,41
					 */
					if(i%7==0){
						html +="<tr>";
					}
					html += '<td data-val="'+resArr.dateArr[i].year + "-" + resArr.dateArr[i].month +"-" + resArr.dateArr[i].showDate +'" '+
						'>'+
					resArr.dateArr[i].showDate+'</td>';
					if(i%7==6){
						html +="</tr>";
					}					
				}

				html +=	'</tbody>'+
			'</table>'+
		'</div>';

		wrapperElem.innerHTML = html;
	}

	datepicker.init = function(ele){

		//渲染页面
		var year = new Date().getFullYear();
		var month = new Date().getMonth() + 1;
		datepicker.render(year,month);		

		//input 绑定事件
		var inputElem = document.getElementById(ele);
		wrapperElem.style.width = inputElem.offsetWidth + "px";
		wrapperElem.style.left = inputElem.offsetLeft + "px";
		wrapperElem.style.top = inputElem.offsetTop + inputElem.offsetHeight + "px";
		//offsetHeight offsetLeft offsetTop
		
		var isOpen = false;

		inputElem.addEventListener("click",function(){
			//控制ui-datepicker-wrapper的现实和隐藏
			if(isOpen){
				//ui-datepicker-wrapper 打开
				wrapperElem.className = "ui-datepicker-wrapper";				
			}else{
				//ui-datepicker-wrapper 关闭
				wrapperElem.className = "ui-datepicker-wrapper ui-datepicker-wrapper-active";			
			}
			isOpen = !isOpen;
		});

		//上一个月、下一个月
		wrapperElem.addEventListener("click",function(e){
			var targetElem = e.target || e.srcElement;
			var targetClassname = ' ' + targetElem.className;
			//str.indexOf("h");			

			if(targetClassname.indexOf("ui-datepicker-btn") < 0) return ;

			if(targetClassname.indexOf("ui-datepicker-prev-btn") > 0){
				//上一月
				datepicker.render(resArr.year,resArr.month-1);
			}else if(targetClassname.indexOf("ui-datepicker-next-btn") > 0){
				//下一月
				datepicker.render(resArr.year,resArr.month+1);
			}
		});

		//td 点击事件
		wrapperElem.addEventListener("click",function(e){
			var targetElem = e.target || e.srcElement;
			//节点名称 nodeName  
			//将字符串转化为小写 进行比较判断 是否是td元素 -- toLowerCase()
			if(targetElem.nodeName.toLowerCase() == 'td'){
				//获得属性值 getAttribute
				//判断元素是不是有某个属性 hasAttribute
				if(targetElem.hasAttribute("disabled")) return;
				var date = targetElem.getAttribute("data-val");
				inputElem.value = date;

				wrapperElem.className = "ui-datepicker-wrapper";
				isOpen = false;
			}
		});
	}

	window.datepicker = datepicker;

})();
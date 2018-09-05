$(function () {
	$('#')
	//公共方法
	playFloatBox('http://img.cdn.jisutp.com/common/float/5.png', 2);
	initPjax();
	//  initEvent();
	//底部搜索按钮   公共
	$('.search-player').click(function () {
		showSearch(tplCfg.bom.search);
	});

	//弹出窗口确定按钮  公共
	$('body').on('click', '.sure-btn', function () {
		var text = $('.window-input').val();
		if (text == '') {
			return;
		}
		layer.closeAll();
		showSearch(tplCfg.bom.yanzhengma);
	});

	//底部投票按钮  进行投票   公共
	$('.vote-bottom').click(function () {
		showSearch(tplCfg.bom.erweima);
	});

	//关闭弹出窗口   公共
	$('body').on('click', '.close-btn', function () {
		layer.closeAll();
	});

});

function initEvent() {

	$('.musice').unbind('click').click(function () {
		transformState();
	});

	$('.apply').unbind('click').click(function () {
		$('.nav').find('li').eq(2).find('.nav-all').addClass("nav-style").parents('li').siblings('li').find('.nav-all').removeClass('nav-style');
	});

	$('.nav .changeLiColor').click(function () {
		$(this).find('.nav-all').addClass("nav-style");
		$(this).siblings('li').find('.nav-all').removeClass("nav-style");
	});

	//选中选手  加载多次
	$('#masonry').unbind('click').on('click', '.vote-sure', function () {
		if (tplCfg.param.rule_type === 1) { //单选
			showSearch(tplCfg.bom.erweima);
		} else { //多选
			_this = $(this);
			maxChoose();
			var num = parseInt($.cookie("chooseNumber"));
			if (num > tplCfg.param.rule_choose_max) {
				return;
			}
			$(this).removeClass('vote-sure').addClass('vote-cancel').children().remove();
			$(this).siblings('.player-info').addClass('choosed-vote');
			$(this).append('<span class="glyphicon glyphicon-ok-sign font-xi"></span> <span>取消选择</span>');
			addgetCookie(_this);
		}

	});

	//取消选中选手    加载多次
	$('#masonry').on('click', '.vote-cancel', function () {
		_this = $(this);
		$(this).removeClass('vote-cancel').addClass('vote-sure').children().remove();
		$(this).siblings('.player-info').removeClass('choosed-vote');
		$(this).append('<span class="glyphicon glyphicon-thumbs-up font-xi"></span> <span>投票</span>');
		removegetCookie(_this);
	});

	//选中上面的种类按钮   加载多次
	$('.kind-choose li').click(function () {
		$(this).find('.btn').addClass('hover-style').parent('li').siblings('li').find('.btn').removeClass('hover-style');
	});

	//点击关闭下面的 按钮 加载多次
	$('.close-vote-bottom').click(function () {
		voteNumberDown();
		$.cookie('selectPlayer', '', {
			expires: -1
		});
		$.cookie('chooseNumber', '', {
			expires: -1
		});
		$('#masonry').find('.box').find('.player-info').removeClass('choosed-vote');
		$('#masonry .box .vote-cancel').children().remove();
		$('#masonry .box .vote-cancel').append('<span class="glyphicon glyphicon-thumbs-up font-xi"></span> <span>投票</span>').removeClass('vote-cancel').addClass('vote-sure');
		$('.click-vote').removeClass('true').addClass('false').html('选择');
	});

	//活动详情 展开和折叠  加载多次
	$('.activity-particular').unbind('click').click(function () {
		if ($(this).hasClass('show-particular')) {
			$(this).removeClass('show-particular').addClass('hide-particular').find('span').eq(0).html('展开');
			$(this).find('span').eq(1).removeClass('transform-deg');
			$('.particurlar-content').slideUp();
		} else {
			$(this).removeClass('hide-particular').addClass('show-particular').find('span').eq(0).html('折叠');
			$(this).find('span').eq(1).addClass('transform-deg');
			$('.particurlar-content').slideDown();
		}
	});

	//选手详情页     点击选中  加载多次
	$('.click-vote').unbind('click').click(function () {
		if ($(this).hasClass('false')) {
			maxChoose();
			var num = parseInt($.cookie("chooseNumber"));
			if (num > tplCfg.param.rule_choose_max) {
				return;
			}
			$(this).removeClass('false').addClass('true').html('已选择，点击取消');
			addSingleCookie();
		} else {
			$(this).removeClass('true').addClass('false').html('选择');
			removeSingleCookie();
		}
	});

	$('.submit-info').unbind('click').click(function () {
		var name = $('#info-name').siblings('input').val();
		var kind = $("#info-kind").siblings('select').val();
		if (name == '') {
			writeInfo('请填写名称', '#info-name');
		} else if (kind == '请选择') {
			writeInfo('请选择分类', '#info-kind');
		} else {
			alert('请求接口');
		}
	});

	initScroll();
	initWarnWord();

	$('#file-img').unbind('change').change(function () {
		loadImg();
	});

	$('.append-img').on('click', '.delete-pic', function () {
		$(this).parents('.img-box').remove();
	});
}

function loadImg() {
	var img_file = document.getElementById("file-img");
	var fileData = img_file.files[0];
	var url = window.URL.createObjectURL(fileData); //获取本地地址
	console.log(url);
	$('.append-img').append('<div class="col-xs-6 img-box">' +
		'<div class="load-pic-grid">' +
		'<span class="glyphicon glyphicon-remove-sign delete-pic"></span>' +
		'<img src="' + url + '" class="load-pic" />' +
		'</div>' +
		'</div>');
}

function start_time() {
	if (window.diff_time) clearTimeout(window.diff_time);
	window.diff_time = setTimeout(function () {
		show_time();
	}, 1000);
}

//时间倒计时
function show_time() {
	var time_distance = tplCfg.param.vote_diff_time--;
	if (time_distance <= 0) {
		$('.timer-inner').html('活动已经结束');
	} else {
		// 天
		var int_day = Math.floor(time_distance / 86400)
		time_distance -= int_day * 86400;
		// 时
		var int_hour = Math.floor(time_distance / 3600)
		time_distance -= int_hour * 3600;
		// 分
		var int_minute = Math.floor(time_distance / 60)
		time_distance -= int_minute * 60;
		// 秒 
		var int_second = Math.floor(time_distance)
		// 时分秒为单数时、前面加零 
		if (int_day < 10 && int_day != 0) {
			int_day = "0" + int_day;
		}
		if (int_hour < 10 && int_hour != 0) {
			int_hour = "0" + int_hour;
		}
		if (int_minute < 10) {
			int_minute = "0" + int_minute;
		}
		if (int_second < 10) {
			int_second = "0" + int_second;
		}
		// 显示时间 
		$('.timer-inner .time-day').html(int_day);
		$('.timer-inner .time-hour').html(int_hour);
		$('.timer-inner .time-minutes').html(int_minute);
		$('.timer-inner .time-second').html(int_second);
		start_time();
	}
}

function writeInfo(word, name) {
	$(document).scrollTop(0);
	layer.tips(word, name, {
		tips: [3, '#cf1405'],
		time: 2000
	});
}

function initChoosed() {
	if ($.cookie('selectPlayer') != undefined) {
		var oldData = $.cookie('selectPlayer');
		var length = $('#masonry').find('.box').length;
		var chooseNumber = oldData.split(',').length - 1;
		for (var i = 0; i < length; i++) {
			var classRank = $('#masonry').find('.box').eq(i).find('.Player-rank span').attr('class').substr(4);
			if (oldData.indexOf(classRank) > -1) {
				$('#masonry').find('.box').eq(i).find('.vote-sure').removeClass('vote-sure').addClass('vote-cancel').children().remove();
				$('#masonry').find('.box').eq(i).find('.player-info').addClass('choosed-vote');
				$('#masonry').find('.box').eq(i).children('div:last').append('<span class="glyphicon glyphicon-ok-sign font-xi"></span> <span>取消选择</span>');
			}
		}
		if (chooseNumber > 0) {
			voteNumberUp();
			$('.vote-number .red').html(chooseNumber);
		}
	}
}

function initWarnWord() {
	var state = $('.vote-number').css('display');
	if (state == 'block') {
		$('.warn-word').css('margin-bottom', '50px');
	}
}

function verAudioIcon(audioObj, iconObj) {
	if (audioObj[0].paused) {
		iconObj.removeClass('animation-rotate');
	} else {
		iconObj.addClass('animation-rotate');
	}
}

function transformState() {
	var audioObj = $('audio');
	var iconObj = $('.musice');
	console.log(audioObj);
	console.log(iconObj);
	if (audioObj[0].paused) {
		iconObj.addClass('animation-rotate');
		audioObj[0].play();
	} else {
		iconObj.removeClass('animation-rotate');
		audioObj[0].pause();
	}
	verAudioIcon(audioObj, iconObj);
}

function showSearch(html) {
	var isIOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
	var ly = layer.open({
		title: false,
		type: 1,
		area: 'auto',
		content: html,
		fixed: !isIOS,
		closeBtn: 0
	});
	layer.style(ly, {
		background: 'none',
		boxShadow: 'none',
	});

	var st = $(document).scrollTop();
	var dh = $(window).height();
	if (isIOS) {
		layer.style(ly, {
			position: 'absolute',
			top: st + dh / 2 - ($('.layui-layer-content').height() / 2) + 'px'
		});
	}
	$('body .window-input').focus();
}

function maxChoose() {
	var num = parseInt($.cookie("chooseNumber"));
	if (num > tplCfg.param.rule_choose_max) {
		layer.open({
			type: 1,
			title: false,
			closeBtn: 0,
			content: '<div class="warn-maxchoose">最多选择十个</div>'
		});
		setTimeout(function () {
			layer.closeAll();
		}, 1000);
	}
}

function voteNumberUp() {
	$('.vote-number').slideDown();
	$('.warn-word').css({
		'margin-bottom': 50 + 'px'
	})
}

function voteNumberDown() {
	$('.vote-number').slideUp();
	$('.warn-word').css({
		'margin-bottom': 10 + 'px'
	})
}

function singlePlayerInfoChoosed() {
	var oldData = $.cookie('selectPlayer');
	if (oldData) {
		var Id = $('.playerinfo-data li:first span').attr('class').substr(4);
		if (oldData.indexOf(Id) > -1) {
			$('.click-vote').removeClass('false').addClass('true').html('已选择，点击取消');
		}
	}
}

function addSingleCookie() {
	var data = $.cookie('chooseNumber');
	var arr = $('.playerinfo-data li:first span').attr('class').substr(4);
	var selectPlayer = $.cookie('selectPlayer');
	if (selectPlayer == undefined) { //第一次创建
		$.cookie('selectPlayer', arr + ',');
	} else {
		var idStrOld = $.cookie('selectPlayer');
		var idStrnew = idStrOld + arr + ',';
		$.cookie('selectPlayer', idStrnew);
	}
	if (data == undefined) {
		$.cookie('chooseNumber', '1');
	} else {
		var number = parseInt($.cookie('chooseNumber'));
		number += 1;
		$.cookie('chooseNumber', number);
	}
	var number = $.cookie('chooseNumber');
	if (number > 0) {
		voteNumberUp();
	} else {
		voteNumberDown();
	}
	$('.vote-number .red').html(number);
}

function removeSingleCookie() {
	var data = $.cookie('chooseNumber');
	var arr = $('.playerinfo-data li:first span').attr('class').substr(4) + ',';
	var idStrOld = $.cookie('selectPlayer');
	var idStrNew = idStrOld.replace(arr, '');
	$.cookie('selectPlayer', idStrNew);

	if (data == undefined) {
		$.cookie('chooseNumber', '1');
	} else {
		var number = parseInt($.cookie('chooseNumber'));
		number -= 1;
		$.cookie('chooseNumber', number);
	}
	var number = $.cookie('chooseNumber');
	if (number > 0) {
		voteNumberUp();
	} else {
		voteNumberDown();
	}
	$('.vote-number .red').html(number);
}

function addgetCookie(_this) {
	var data = $.cookie('chooseNumber');
	var arr = _this.siblings('.player-info').find('.Player-rank').children('span').attr('class').substr(4);
	var selectPlayer = $.cookie('selectPlayer');
	if (selectPlayer == undefined) { //第一次创建
		$.cookie('selectPlayer', arr + ',');
	} else {
		var idStrOld = $.cookie('selectPlayer');
		var idStrnew = idStrOld + arr + ',';
		$.cookie('selectPlayer', idStrnew);
	}
	if (data == undefined) {
		$.cookie('chooseNumber', '1');
	} else {
		var number = parseInt($.cookie('chooseNumber'));
		number += 1;
		$.cookie('chooseNumber', number);
	}
	var number = $.cookie('chooseNumber');
	if (number > 0) {
		voteNumberUp();
	} else {
		voteNumberDown();
	}
	$('.vote-number .red').html(number);
}

function removegetCookie(_this) {
	var data = $.cookie('chooseNumber');
	var arr = _this.siblings('.player-info').find('.Player-rank').children('span').attr('class').substr(4) + ',';
	var idStrOld = $.cookie('selectPlayer');
	var idStrNew = idStrOld.replace(arr, '');
	$.cookie('selectPlayer', idStrNew);

	if (data == undefined) {
		$.cookie('chooseNumber', '1');
	} else {
		var number = parseInt($.cookie('chooseNumber'));
		number -= 1;
		$.cookie('chooseNumber', number);
	}
	var number = $.cookie('chooseNumber');
	if (number > 0) {
		voteNumberUp();
	} else {
		voteNumberDown();
	}
	$('.vote-number .red').html(number);
}




function initSwiper() {
	var mySwiper = new Swiper('.swiper-container', {
		loop: true,
		autoplay: 2000
	});
}

function playFloatBox(content, type) {
	if (!content) return;
	var bom = type === 1 ? '<span><i class="fa fa-' + content + '"></i></span>' : '<img class="not-js-style" src="' + content + '">';
	var floatBox = $('.widget-float-box');
	for (var i = 0; i < 20; i++) {
		floatBox.append('<li>' + bom + '</li>')
	}
	var param = {
		delay: [400, 12000],
		left: [0, 90],
		duration: [2000, 20000],
		width: [1, 2]
	};
	floatBox.find('li').each(function (index) {
		var i = index + 1;
		var delay = Math.floor(param.delay[0] + Math.random() * (param.delay[1] - param.delay[0])) + Math.floor(200 + Math.random() * (200 - 50));
		var left = Math.floor(param.left[0] + Math.random() * (param.left[1] - param.left[0]));
		var duration = Math.floor(param.duration[0] + Math.random() * (param.duration[1] - param.duration[0])) + Math.floor(1000 + Math.random() * (1000 - 200));
		var width = Math.floor(param.width[0] + Math.random() * (param.width[1] - param.width[0]));
		floatBox.find('li').eq(i).css({
			left: left + '%',
			animationDelay: delay + "ms",
			animationDuration: duration + "ms",
			width: width + 'rem',
			fontSize: width + 'rem'
		});
	});
}

function rankcontent(item) {
	$('.rank-form tbody').append('<tr><td>' + item.index + '</td><td><a href="playerInfo.html">' + item.index + ':' + item.title + '</a></td><td>' + item.count + '</td></tr>');
}


function loadRank() {
	$.get({
		async: false,
		url: "demo.json",
		data: {},
		success: function (data) {
			if (data.code === 1) {
				if (data.data && data.data.length > 0) {
					$.each(data.data, function (index, item) {
						rankcontent(item);
					});
				} else {
					//                  tplCfg.load.done = true;
				}
			}
			//          tplCfg.load.ing = false;
		},
		error: function () {
			//          tplCfg.load.ing = false;
		}
	});
}

function initScroll() {
	$(document).scroll(function () {
		var documentTop = $(document).scrollTop();
		if ($('.loading-box').length < 1) return;
		var loadbox = $('.loading-box')[0];
		var doc = document.documentElement;
		var clientHeight = doc.clientHeight;
		var viewportOffset = loadbox.getBoundingClientRect();
		var buttonTop = viewportOffset.top;
		if (buttonTop <= clientHeight - 100) {
			getVoteItem();
		}
	});
}

function getVoteItem() {
	if (tplCfg.bom.vote_item_box.length <= 0) return;
	if (tplCfg.load.done || tplCfg.load.ing) return;
	loadStatus(true, '加载中...');
	tplCfg.load.ing = true;
	$.get({
		async: false,
		url: "demo.json",
		data: {
			page: tplCfg.load.page
		},
		success: function (data) {
			if (data.code === 1) {
				if (data.data && data.data.length > 0) {
					tplCfg.load.page++;
					$.each(data.data, function (index, item) {
						appendVoteItem(item);
					});
					loadStatus(false, '加载更多...');
				} else {
					tplCfg.load.done = true;
					loadStatus(false, '已全部加载~');
				}
			}
			tplCfg.load.ing = false;
		},
		error: function () {
			tplCfg.load.ing = false;
			loadStatus(false, '加载失败，请刷新重试~');
		}
	});
}

function loadStatus(icon, msg) {
	var obj = tplCfg.bom.vote_item_load_box;
	if (icon) obj.find('.icon').show();
	else obj.find('.icon').hide();
	if (msg) obj.find('.msg').text(msg).show();
	else obj.find('.msg').hide();
	if (!icon && !msg) obj.hide();
	else obj.show();
}

function appendVoteItem(item) {
	var obj = $('.hide').find('.box').clone();
	obj.addClass('col-xs-' + tplCfg.param.display_show_column_col);
	obj.attr('_vote_item_id', item.id); //标记id
	if (item.index !== undefined) obj.find('.player-number').text(item.index);
	else obj.find('.player-number').hide();
	if (item.title !== undefined) {
		//      obj.find('.player-info > .Player-name').attr('href', tplCfg.urls.url_vote_detail + '?id=' + item.id);
		obj.find('.player-info > .Player-name').attr('href', 'playerInfo.html');
		obj.find('.player-info > .Player-name').text(item.title);
	} else {
		obj.find('.player-info > .Player-name').hide();
	}
	if (tplCfg.param.hide_index_vote_cover) {
		if (tplCfg.param.hide_index_vote_index) {
			obj.find('.play-img').hide();
		} else {
			obj.find('.play-img').css('border', 'none').find('.img').replaceWith('<div style="height:40px;"></div>');
		}
	} else {
		if (!!item.cover) obj.find('.play-img').attr('src', item.cover);
		else obj.find('.play-img').attr('src', tplCfg.urls.empty_cover);
	}

	if (tplCfg.param.hide_index_vote_btn) obj.find('.vote-sure').hide();
	if (tplCfg.param.hide_index_vote_index) obj.find('.left-top-rank').hide();
	if (tplCfg.param.hide_index_vote_title) obj.find('.Player-name').hide();
	if (tplCfg.param.hide_index_vote_count) obj.find('.Player-rank').hide();

	if (item.count !== undefined) obj.find('.Player-rank').html('<span class="cnt_' + item.id + '">' + item.count + '</span>' + tplCfg.param.text_vote_item_unit);
	else obj.find('.Player-rank').hide();
	obj.find('.play-img').parent('a').attr('href', tplCfg.urls.url_vote_detail + '?id=' + item.id);
	var box = tplCfg.bom.vote_item_box;
	box.masonry().append(obj).masonry('appended', obj);
	// box.imagesLoaded(function () {
	// 	box.masonry();
	// });
	//voteBtnBindClick(obj);//绑定点击事件
}

function initPjax() {
	if (!!(window.history && history.pushState)) {
		$(document).pjax('a:not(a[target="_blank"])', 'div[id="pjax-box"]', {
			fragment: 'div[id="pjax-box"]',
			time: 5000
		});
	}
}
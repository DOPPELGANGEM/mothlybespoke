//cta link
function openCtaLink(url,target){
	if(url.indexOf('javascript:downloadFileCms') >= 0){
		var sIdx = url.indexOf("(");
		var eIdx = url.indexOf(")");
		var lettNo = url.substring(sIdx+1,eIdx);
		
		downloadFileCms(lettNo);
	}else{
		window.open(url, target);
	}
}
//영상 레이어팝업 노출 시 자동재생 - iframe 삽입시 옵션 ?autoplay=1 삽입(레이어팝업 오픈시 자동재생)
function compLayerOpenPlay(elem){
	if($(elem).find("video").length > 0){
		$(elem).find("video").get(0).play();
	}
}

function fnGetPrdForComponent(obj) {
	
	var goodsId = $(obj).data('goods-id');
	var targetId = $(obj).data('target-id');
	var componentId = $(obj).data('component-id');
	var stContextPath = $(obj).data('st-context-path');
	
	if ($(obj).prop('checked') || (!$(obj).hasClass('focused') && !$(obj).hasClass('disabled'))) {
		$.ajax({
			url : stContextPath+'xhr/display/componentGoods'
			, type : "POST"
			, data : {goodsId: goodsId, targetId: targetId}
			, success: function (data) {
				if(data.html != null && data.html != ""){
					$('#' + data.targetId).html(data.html);
				}
				setTimeout(function(){
					listHeightControl('#' + componentId, '.box-product-card');
				}, 100);
			}
		});
	}
}

function fnGetPrdCardForComponent(obj) {
	
	var goodsId = $(obj).data('goods-id');
	var targetId = $(obj).data('target-id');
	var componentId = $(obj).data('component-id');
	var stContextPath = $(obj).data('st-context-path');
	
	if ($(obj).prop('checked') || (!$(obj).hasClass('focused') && !$(obj).hasClass('disabled'))) {
		$.ajax({
			url : stContextPath+'xhr/display/componentGoodsForPrdtCard'
			, type : "POST"
			, data : {goodsId: goodsId, targetId: targetId}
			, success: function (data) {
				if(data.html != null && data.html != ""){
					$('#' + data.targetId).html(data.html);
					const observer = lozad();
			    	observer.observe();
				}
				/* 2020-10-30 수정 */
				$("#" + componentId + " .card-images").each(function() {
					$(this).height($(this).outerWidth());
				});
				listHeightControl('#' + componentId, '.box-product-card');
				$(window).scrollTop($('#' + targetId).offset().top);
				filterSel();
				colorOptSel();
				/* // 2020-10-30 수정 */
			}
		});
	}
}

$(function(){
	// 200623
	$(window).resize(function(){
		var winw = $(window).width();
		if(winw > 800){  // 모바일 사이즈 800 부터
			$(".wrap-component").find(".visual-area").find("img").each(function(){
				var src = $(this).attr("data-pcimg-src");
				$(this).attr("src", src);
			});
			
			$(".gallery-carousel").find(".visual-area").find("a").each(function(){
				var src = $(this).attr("data-pc-src-origin");
				$(this).attr("data-src-origin", src);
			});
			
		} else {
			$(".wrap-component").find(".visual-area").find("img").each(function(){
				var src = $(this).attr("data-mimg-src");
				if(src != ""){
					$(this).attr("src", src);
				}
			});
			
			$(".gallery-carousel").find(".visual-area").find("a").each(function(){
				var src = $(this).attr("data-mo-src-origin");
				if(src != ""){
					$(this).attr("data-src-origin", src);
				}
			});
		}
		
		if(winw > 801){
			$(".wrap-component.feature-benefit .component-text .box-disc .disc").css('display','block');
		} else{
			$(".wrap-component.feature-benefit .component-text .box-disc .disc").css('display','none');
		}

	}).resize();
	
	// 영상 팝업 열기
	$(document).on("click", "[data-popup-target]", function(e){
		e.preventDefault();
		var target = $(this).attr("data-popup-target");
		if($("#"+target).hasClass("popup-comp-player")){
			if(!$("#"+target).hasClass("embed")) 
				$("#mask").addClass("video-player");
		}
	});
	
	// 영상 팝업 닫을 시 영상 멈춤
	$(document).on("click", ".popup-comp-player .pop-close, #mask.video-player", function(e){
		e.preventDefault();
		if($(this).parents(".popup-comp-player").length > 0) {
			var video = $(this).parents(".popup-comp-player").find("video");
			if(video.length > 0) video.get(0).pause();
		}
	});
	
	
	// 갤러리 이미지 클릭 이벤트
	var $galleyMainSliderSlide = $(".slider-grid-gallery").find(".slide-visual");
	$galleyMainSliderSlide.find(".visual").click(function(e){
		e.preventDefault();
		var name = $(this).attr("data-popup-name");
		var idx = $(this).attr("data-visual-index");
		
		$(this).attr("data-popup-target", name);  // popup target 생성
		displayGallery($(this), idx);  // 팝업 내 슬라이드 처리
		setTimeout(function(){
			$("#mask").addClass("gallery");
		}, 100);
	});
	
	var setGalleryDetail = {
		infinite: false,
		arrow: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		centerMode: true,
		fade: true,
		cssEase: 'linear',
		responsive: [
		{
			breakpoint: 801,
			settings: {
				arrows: true,
			}
		}]
	};
	// 갤러리 레이어팝업 이미지 슬라이드 처리
	var initGalleryDetail;
	function displayGallery(elem, idx){
		var $html = "";
		var popup = elem.attr("data-popup-name");
		elem.parents(".slide-visual").find(".row").each(function(){
			$(this).find("a").each(function(){
				var origin = $(this).attr("data-src-origin");
				var desc = $(this).find("img").attr("alt")
				$html += "<div class='big'><img src='" + origin + "' alt='" + desc + "'></div>";
			});
		});
		$("#"+popup).find(".slider-gallery-detail").not(".slick-initialized").html($html);
		setTimeout(function(){ 
			initGalleryDetail = $("#"+popup).find(".slider-gallery-detail").not(".slick-initialized").slick(setGalleryDetail);
			//initGalleryDetail.slick("slickAdd", $html);
			initGalleryDetail.slick("slickGoTo", idx);
		}, 300);
	}

	// 갤러리 레이어팝업 닫을 시 레이어팝업 내 슬라이드 초기화
	$(document).on("click", ".popup-comp-gallery .pop-close, #mask.gallery", function(e){
		e.preventDefault();
		if($(this).parents(".popup-comp-gallery")){
			var slider = $(this).parents(".popup-comp-gallery").find(".slider-gallery-detail");
			if(slider.hasClass("slick-initialized")){
				initGalleryDetail.slick("unslick");
				slider.html("");
			}

			// 클릭했던 이미지로 포커스 간 후에 popup target 삭제
			var popup = $(this).parents(".popup-comp-gallery").attr("id");
			setTimeout(function(){
				$("[data-popup-target='"+popup+"']").removeAttr("data-popup-target");
			}, 100);
		}
	});
	
	$('.gt-wrap').each(function(){
		var $this = $(this);
		var slide = $this.find('.gt-slide');
		setMainSlickDataOmni(slide, $this.data("cptnm"));
	});
});

// slick Play, Stop 버튼 data-omni 셋팅 
function setMainSlickDataOmni(el, cptEnNm) {
	
	//console.log('===== MAIN SLICK [ID:' + $(el).attr("id") +", CptEnNm:" + cptEnNm + "]");
	
	var $this = $(el);
	var wrap = $this.parent();
	setSlickDataOmni(wrap, cptEnNm, 'MAIN');
}
function setPopSlickDataOmni(el, cptEnNm) {
	//console.log('===== POPUP SLICK [ID:' + $(el).attr("id") +", CptEnNm:" + cptEnNm + "]");
	
	setTimeout(function(){
		setSlickDataOmni(el, cptEnNm, 'POP');
	},100)
}
function setSlickDataOmni(el, cptEnNm, callDv) {	
	
	var btnPrev = el.find('.slick-prev');
	var btnNext = el.find('.slick-next');
	var dots = el.find('.slick-dots button');
	var btnPause = el.find('.slide-pause');
	var btnPlay = el.find('.slide-play');
	
	if (btnPrev.length > 0) {
		btnPrev.attr('data-omni',cptEnNm + ':left_arrow');
		//console.log(callDv + '- Arrow Prev data-omni : ' + btnPrev.data('omni'));
	}
	if (btnNext.length > 0) {
		btnNext.attr('data-omni',cptEnNm + ':right_arrow');
		//console.log(callDv + '-Arrow Next data-omni : ' + btnNext.data('omni'));
	}
	if (btnPause.length > 0) {
		//console.log(btnPause);    
		btnPause.attr('data-omni',cptEnNm + ' rolling:index_stop');
		//console.log(callDv + '-StopButton data-omni : ' + btnPause.data('omni'));    
	}
	if (btnPlay.length > 0) {
		btnPlay.attr('data-omni',cptEnNm + ' rolling:index_play');
		//console.log(callDv + '-PlayButton data-omni : ' + btnPlay.data('omni'));
	}
	if (dots.length > 0) {
		for (var dotIdx=0; dotIdx<dots.length; dotIdx++) {
			$(dots[dotIdx]).attr('data-omni', cptEnNm + ' rolling:index_'+(dotIdx+1));
			//console.log(callDv + '-Dots data-omni : ' + $(dots[dotIdx]).attr('data-omni'));
		}
	}
}


// Tab Container 최종 상품가격 실시간 셋팅 
function fnGetLastPrdPrice(goodsObjArr, stContextPath) {
	
	var goodsIdArr = new Array();
	if (goodsObjArr != null && goodsObjArr.length > 0) {
		
		var goodsIdIdx = 0;
		var idStrArr = "";
		for(var idx=0; idx < goodsObjArr.length; idx++) {
			idStrArr = $(goodsObjArr[idx]).attr('id').split("_");
			if(idStrArr.length==5 && idStrArr[3] != '') {
				goodsIdArr[goodsIdIdx++] = idStrArr[3];
			}
		}
		
		if (goodsIdArr.length == 0) return false;
		
		$.ajax({
			data : JSON.stringify({goodsIdArr : goodsIdArr})
			, type : "POST"
			, contentType : "application/json"
			, url : stContextPath+'xhr/display/componentGoodsPrice'
			, success: function (data) {
				if(data.result != null && data.result.length > 0) {		
					data.result.forEach(function(item){
						if (item.lastPrice != "") {
							$("[id$="+item.goodsId+"_prclbl]").text(item.lastPrcLbl);
							$("[id$="+item.goodsId+"_price]").text(item.lastPrice + " 원");
						}
					});
				}
			}
		});
	}
	return true;
}

// Production Selection 전체 상품가격 실시간 셋팅 
function fnGetAllPrdPrice(goodsObjArr, stContextPath) {
	
	var goodsIdArr = new Array();
	if (goodsObjArr != null && goodsObjArr.length > 0) {
		
		var goodsIdIdx = 0;
		var idStrArr = "";
		for(var idx=0; idx < goodsObjArr.length; idx++) {
			idStrArr = $(goodsObjArr[idx]).attr('id').split("_");
			if(idStrArr.length==4 && idStrArr[3] != '') {
				goodsIdArr[goodsIdIdx++] = idStrArr[3];
			}
		}
		
		//console.log("## 상품코드 목록: " + goodsIdArr);
		if (goodsIdArr.length == 0) return false;
		
		$.ajax({
			data : JSON.stringify({goodsIdArr : goodsIdArr})
			, type : "POST"
			, contentType : "application/json"
			, url : stContextPath+'xhr/display/componentGoodsPrice'
			, success: function (data) {
				if(data.result != null && data.result.length > 0) {		    		
		    		data.result.forEach(function(item){
		    			
		    			//console.log("## " + item.goodsNm + " : " + item.goodsId);
		    			
		    			if (item.prdPrice1 != "") {
			    			$("[id$="+item.goodsId+"_prc1]").text(item.prdPrice1 + " 원");
			    			$("[id$="+item.goodsId+"_lbl1]").text(item.prdPrcLbl1);
			    			//console.log("## " + item.prdPrcLbl1 + " : " + item.prdPrice1);
		    			}
		    			
		    			if (item.prdPrice2 != "") {
		    				$("[id$="+item.goodsId+"_prc2]").text(item.prdPrice2 + " 원");
			    			$("[id$="+item.goodsId+"_lbl2]").text(item.prdPrcLbl2);
			    			//console.log("## " + item.prdPrcLbl2 + " : " + item.prdPrice2);
		    			}
		    			if (item.prdPrice3 != "") {
		    				$("[id$="+item.goodsId+"_prc3]").text(item.prdPrice3 + " 원");
			    			$("[id$="+item.goodsId+"_lbl3]").text(item.prdPrcLbl3);
			    			//console.log("## " + item.prdPrcLbl3 + " : " + item.prdPrice3);
		    			}
		    			if (item.prdPrice4 != "") {
		    				$("[id$="+item.goodsId+"_prc4]").text(item.prdPrice4 + " 원");
			    			$("[id$="+item.goodsId+"_lbl4]").text(item.prdPrcLbl4);
			    			//console.log("## " + item.prdPrcLbl4 + " : " + item.prdPrice4);
		    			}
		    		});
		    	}
			}
		});
	}
	return true;
}

function fnGetPrdPrice(topId, arr, stContextPath) {
	var topEl = topId;
	var goodsIdArr = arr;
	var childEl = $('#' + topEl).find('.prd-info[data-sideprd-prdcode-set]');
	if(childEl){
		childEl.each(function(i){
			var thisEl = $(this);
			var thisCode = thisEl.data('sideprd-prdcode-set');
			$.ajax({
				data: JSON.stringify({ goodsIdArr: goodsIdArr })
				, type : "POST"
				, contentType : "application/json"
				, url : stContextPath+'xhr/display/componentGoodsPrice'
				, success: function (data) {
					if (data.result != null && data.result.length > 0) {
						data.result.forEach(function (item) {
							for (var idx = 0; idx < goodsIdArr.length; idx++) {
								if (item.goodsId == thisCode) {
									thisEl.find('.prd-name').html(item.goodsNm);
									thisEl.find('.prd-code').html(item.mdlCode);
									thisEl.find('.reg .count').html(item.prdPrcLbl1);
									thisEl.find('.reg .price').html(item.prdPrice1 + ' 원');
									thisEl.find('.member .count').html(item.prdPrcLbl2);
									thisEl.find('.member .price').html(item.prdPrice2 + ' 원');
									if (item.prdPrice3){
										thisEl.find('.benefit .count').html(item.prdPrcLbl3);
										thisEl.find('.benefit .price').html(item.prdPrice3 + ' 원');
									} else {
										thisEl.find('.benefit').remove();
									}
									thisEl.find('.card-btn a').attr('href', '/sec/' + item.goodsPath);
								}
							}
						});
					}
				}
			});
		});
	}
	return true;
}
function fnGetPrdPriceItr(topId, arr, stContextPath) {
	var topEl = topId;
	var goodsIdArr = arr;
	var childEl = $('#' + topEl).find('.interior-txt[data-interior-prdcode-set]');
	if(childEl){
		childEl.each(function (i) {
			var thisEl = $(this);
			var thisCode = thisEl.data('interior-prdcode-set');
			$.ajax({
				data: JSON.stringify({ goodsIdArr: goodsIdArr })
				, type : "POST"
				, contentType : "application/json"
				, url : stContextPath+'xhr/display/componentGoodsPrice'
				, success: function (data) {
					if (data.result != null && data.result.length > 0) {
						data.result.forEach(function (item) {
							for (var idx = 0; idx < goodsIdArr.length; idx++) {
								if (item.goodsId == thisCode) {
									thisEl.find('.prd-tit').html(item.goodsNm);
									thisEl.find('.prd-code').html(item.mdlCode);
									thisEl.find('.reg .count').html(item.prdPrcLbl1);
									thisEl.find('.reg .price').html(item.prdPrice1 + ' 원');
									thisEl.find('.member .count').html(item.prdPrcLbl2);
									thisEl.find('.member .price').html(item.prdPrice2 + ' 원');
									if (item.prdPrice3){
										thisEl.find('.benefit .count').html(item.prdPrcLbl3);
										thisEl.find('.benefit .price').html(item.prdPrice3 + ' 원');
									} else {
										thisEl.find('.benefit').remove();
									}
									thisEl.parent('.prd-href').attr('href', '/sec/' + item.goodsPath);
								}
							}
						});
					}
				}
			});
		});
	}
	return true;
}	


//========================================================
// B2B e-제안서 다운로드
function downloadFileCms(lettNo) {
	var fileInfo;
	var options = {
		url : "/sec/business/xhr/insights/getFileInfoCms",
		data : {lettNo : lettNo},
		async : false,
		done : function(data) {
			fileInfo = data;
		}
	};
	ajax.call(options);
	
	if (fileInfo == undefined) {
		var alertData = {
			 title: ""
			,content : "파일이 존재하지 않습니다." 
			,callback : "" 
			,btnText : "확인"
		};
		commonAlert(alertData);
		openLayer('commonAlert');
		return;
	}
	
	
	var cnsntYn =  $.cookie('cnsntYn');
	
	var link = document.location.pathname;
	console.log(link);
	
	if (cnsntYn == "Y") {
		if (fileInfo.downYn == "Y") {
			if (fileInfo.file.orgFlNm == "") {
				var alertData = {
					 title: ""
					,content : "파일이 존재하지 않습니다." 
					,callback : "" 
					,btnText : "확인"
				};
				commonAlert(alertData);
				openLayer('commonAlert');
			}
			else {
				var data = {
					filePath : fileInfo.file.phyPath,
					fileName : fileInfo.file.orgFlNm
				}
				createFormSubmit("fileDownload", "/sec/business/common/fileDownloadResult/", fileInfo);
			}
		}
		else {
			window.open(fileInfo.url, '_blank');
		}
	}
	else {
		$("#popupIdentificationCms div.cont > img").attr("src", fileInfo.letter.imgPath);
		$("#popupIdentificationCms div.cont > img").attr("alt", fileInfo.letter.ttl);
		$("#popupIdentificationCms div.cont > p").text(fileInfo.letter.ttl);

		$("#popupIdentificationCms .login").attr("href", "/sec/business/member/indexLogin/?returnUrl="+link);
		
		if (fileInfo.email == "") {
			$("#email-identification-cms").val("");
		}
		else {
			$("#email-identification-cms").val(fileInfo.email);
			$("#popupIdentificationCms #email-identification-cms").attr("disabled", "disabled");
			$("#popupIdentificationCms .btn-box").hide();
			
			$("#popupIdentificationCms .error-msg > p").text("비즈니스 정보 열람/구독 신청을 진행해 주세요.");
			$("#email-identification-cms").addClass("error");
		}
		
		$("#checkCmsFileBtn").data("lett-no", fileInfo.letter.lettNo);
		$("#checkCmsFileBtn").trigger("click");
		
		return false;
	}
}


function checkEmailCms() {
	var email = $("#email-identification-cms").val().trim();
	
	if (email == "") {
		$("#popupIdentificationCms .error-msg > p").text("이메일을 입력해 주세요.");
		$("#email-identification-cms").addClass("error");
	} else if (!valid.email.test(email)) {
		$("#popupIdentificationCms .error-msg > p").text("이메일을 정확히 입력해 주세요.");
		$("#email-identification-cms").addClass("error");
	} else {
		var checkYn = checkNewsletterYnCms(email);
		
		$.cookie('cnsntYn', checkYn);
		
		if (checkYn == "Y") {
			closeLayer('popupIdentificationCms');
			
			var lettNo = $("#checkCmsFileBtn").data("lett-no");
			downloadFileCms(lettNo);
		} else {
			$("#popupIdentificationCms .error-msg > p").text("수신동의된 이메일이 아닙니다.");
			$("#email-identification-cms").addClass("error");
		}
	}
}

// 뉴스레터 신청 여부 확인 
function checkNewsletterYnCms(email) {
	var checkYn = "";

	var options = {
		url : "/sec/business/xhr/insights/checkNewsletterYn",
		data : {email : email},
		async : false,
		done : function(data) {
			checkYn = data.checkYn;
		}
	};
	ajax.call(options);

	return checkYn;
}


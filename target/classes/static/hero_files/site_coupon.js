var SITE_COUPON = function(){
	var $couopn_list;
	var $case_product_list;
	var $case_category_list;
	var page = 1;
	var init = function (){
		$couopn_list = $("#couopn_list");
		getMypageCouponList();
	};
  
  function getExcludedProdList() {
    $('.exluded_list_warp').find('');
  }
	function getMypageCouponList(){
		$.ajax({
			type: "POST",
			url: ("/shop/mypage_coupon_list.cm"),
			dataType: "json",
			async: true,
			cache: false,
			success: function(res){
				if(res.msg === "SUCCESS"){
					$couopn_list.find("._coupon_list").html(res.html);

					$couopn_list.find("._down_coupon_btn").off("click._down_coupon_btn").on("click._down_coupon_btn",function(){
						var code = $(this).data("code");
						if(code !== ""){
							downCoupon(code);
						}
					});

					setCouponTargetDialog();
					setCouponUseDialog();
				}else{
					alert(res.msg);
				}
			}
		});
	}

	//쿠폰 다운받기
	function downCoupon(code){
		$.ajax({
			type: 'POST',
			data : {code:code},
			url: ('/shop/mypage_down_use_coupon.cm'),
			dataType: 'json',
			async: true,
			cache: false,
			success: function(res){
				if(res.msg == "SUCCESS"){
					$(".modal_mypage_coupon_use_list").find("._coupon_down_wrap_"+code).hide();
					$couopn_list.find("._coupon_down_wrap_"+code).hide();
					$couopn_list.find(".btn_down_complete_wrap_"+code).show();

				}else{
					alert(res.msg);
				}
			}
		});
	}


	//쿠폰적용 다이얼로그 설정
	function setCouponTargetDialog(){

		$couopn_list.find("._coupon_target_btn").off("click.coupon_target_btn").on("click.coupon_target_btn",function(){
			var coupon_code = $(this).data("code");
			if(!isBlank(coupon_code)){
				$.ajax({
					type: 'POST',
					data : {coupon_code:coupon_code},
					url: ('/dialog/mypage_coupon_target.cm'),
					dataType: 'html',
					async: true,
					cache: false,
					success: function(res){
						$.cocoaDialog.open({type : 'mypage_coupon_target', custom_popup : $(res)});
					}
				});
			}
		});
	}
	function setCouponUseDialog(){
		$couopn_list.find("._coupon_use_btn").off("click").on("click.coupon_use_btn", function () {
      var coupon_code = $(this).data("code");
      $.ajax({
        type: 'POST',
        url: ('/dialog/mypage_coupon_use_list.cm'),
        data: {code: coupon_code},
        dataType: 'json',
        async: true,
        cache: false,
        success: function(res) {
          if (res.msg === "SUCCESS") {
            $.cocoaDialog.open(
              //모달이 오픈되었을때
              {type: 'mypage_coupon_use_list', custom_popup: $(res.html)},
              function() {
                $case_category_list = $("._case_category_wrap");
                $case_product_list = $("._case_product_wrap");
                getCouponApplyList(true, coupon_code);
                $(".modal_mypage_coupon_use_list").
                  find("._down_coupon_btn").
                  off("click._down_coupon_btn").
                  on("click._down_coupon_btn", function() {
                    var code = $(this).data("code");
                    if (code !== "") {
                      downCoupon(code);
                    }
                  });
              });
            // 사용제외 목록 on / off
            /**
             * 모달에 사용제외 목록이 붙어있는데, 얘는 사용제외가 있을 경우에만 생성이 되기때문에 모달 오픈후에 뿌려주도록 스크립트를 넣어줌 ! 
             * 모양이 보기좋지는 않기때문에... 시간이 된다면 수정예정
             * */
            const excluded_list = document.querySelectorAll('.excluded_list_warp');
            if (excluded_list.length !== 0) {
              excluded_list.forEach(list => {
                let ExcludedShowBtn = list.querySelector(
                  '._btn_show_excluded_prod_list');
                let ExcludedHideBtn = list.querySelector(
                  '._btn_hide_excluded_prod_list');
                ExcludedShowBtn.addEventListener('click', (e) => {
                  ExcludedShowBtn.classList.add('hide');
                  ExcludedHideBtn.classList.add('show');
                  list.querySelector('._coupon_excluded_text_wrap').
                    classList.
                    add('show');
                });
                ExcludedHideBtn.addEventListener('click', (e) => {
                  ExcludedHideBtn.classList.add('hide');
                  ExcludedHideBtn.classList.remove('show');
                  ExcludedShowBtn.classList.remove('hide');
                  list.querySelector('._coupon_excluded_text_wrap').
                    classList.
                    remove('show');
                });
              });
            }
          } else {
            alert(res.msg);
          }
        }
      });
    });
	}
  
	function getCouponApplyList(list_clear,code){
		if(list_clear === true) {
			page = 1;
			$case_category_list.empty();
			$case_product_list.empty();
			$(".modal_mypage_coupon_use_list").find(".more").hide();
		}
		$.ajax({
			type: 'POST',
			url: ('/dialog/get_coupon_apply_list.cm'),
			data : {"code" : code, "page" : page},
			dataType: 'json',
			async: true,
			cache: false,
			success: function (res){
				if(res.msg === "SUCCESS"){
					if(res.is_category === "Y"){
						$case_category_list.append(res.html);
					}else{
						$case_product_list.append(res.html);
					}
					page+=1;
					if(res.is_more === "N") $(".modal_mypage_coupon_use_list").find(".more").hide();
					else $(".modal_mypage_coupon_use_list").find(".more").show();
				}else{
					alert(res.msg);
				}
			}
		});
	}
	return {
		init:function(){
			init();
		},
		getCouponApplyList: function(list_clear,code){
			getCouponApplyList(list_clear,code);
		}
	}
}();
jQuery(function($){

function tableScroll() {
	// ウインドウ幅が767px以下のとき
	if( window.innerWidth <= 767 ) {
		// tableがdivで囲われていなければdivで囲う
		if( $('table').parent('.table-grad').length === 0 ) {
			$('table').wrap('<div class="table-wrap table-grad"></div>');
		}

		$('.table-wrap').map(function(){
			var $this = $(this);
			var wrap_w = $this.width();
			var table_w = $this.find('table').outerWidth();

			if(wrap_w === table_w) {
				$this.removeClass('table-grad');
			} else {
				$this.addClass('table-grad');
			}
		});

		// tableを横スクロールしたとき
		$(".table-wrap").on("scroll", function () {
			var $this = $(this);
			var scroll = $this.scrollLeft();// スクロール量

			// 最初の位置に戻ったら、table右のグラデを再表示
			if (scroll === 0) {
				$this.addClass('table-grad');
			}

			// 最初の位置以外だったらtable右のグラデを削除
			else {
				$this.removeClass('table-grad');
			}
		});
	}

	// ウインドウ幅が768px以上のとき
	else {
		// tableがdivで囲われていた場合のみ、そのdivを削除する
		if( $('table').parent('.table-grad').length > 0 ) {
			$('table').unwrap();
		}
	}
}

$(function() {
	width = $(window).innerWidth();// ウインドウ幅取得

	// 開いた幅でtableスクロール発火
	tableScroll();

	// ウインドウ幅を変更したら、tableスクロールを発火
	$(window).resize(function(){
		resizeWidth = $(window).innerWidth();

		if( width == resizeWidth ) {
			return;
		} else {
			tableScroll();
		}
	});
});

});
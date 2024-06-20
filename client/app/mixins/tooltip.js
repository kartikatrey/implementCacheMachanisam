import $ from 'jquery'
export default {
	directives: {
		tooltip: {
			bind: function (el) {
				el.style.textOverflow = "ellipsis";
				el.style.display = "inline-block";
				el.style.whiteSpace = "nowrap";
				el.style.overflow = "hidden";
				el.addEventListener('mouseover', function (evt) {
					let element = evt.target;
					if(element.type != "button") return;
					const canvas =  document.createElement('canvas');
					const ctx = canvas.getContext('2d');
					const styles = getComputedStyle(element);
					ctx.font = `${styles.fontWeight} ${styles.fontSize} ${styles.fontFamily}`;
					const widthTxt = ctx.measureText(element.innerText).width;
					let offset = 4;
					if (widthTxt+offset > $(element).width()) {
						element.setAttribute('title', evt.target.textContent);
					} else {
						element.hasAttribute('title') && element.removeAttribute('title');
					}
				});
			}
		}
	}
};

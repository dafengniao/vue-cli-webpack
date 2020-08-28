const isCanvasSupported = () => {
	let elem = document.createElement('canvas')
	return !!(elem.getContext && elem.getContext('2d'))
}

const supportCanvas = isCanvasSupported()
const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')

const getBodyFontFamily = () => {
	return getComputedStyle(document.body).getPropertyValue('font-family')
}

const measureBycanvas = (text, fontSize, fontFamily) => {
	if (!fontFamily) {
		fontFamily = getBodyFontFamily()
	}
	ctx.font = fontSize + ' ' + fontFamily
	return ctx.measureText(text).width
}

const getSpan = () => {
	let span = null
	return (disableReuse) => {
		if (disableReuse || !span) {
			if (span) {
				span.parentNode.removeChild(span)
			}
			span = document.createElement('span')
			document.body.appendChild(span)
			span.style.visibility = 'hidden'
		}
		return span
	}
}
const measureBySpan = (text, fontSize, fontFamily, disableReuse) => {
	let span = getSpan(disableReuse)
	span.innerHTML = text
	span.style.fontSize = fontSize
	if (fontFamily) {
		span.style.fontFamily = fontFamily
	}
	let width = span.offsetWidth
	span.innerHTML = ''
	return width
}

const getTextWidth = (text, fontSize = '14px', fontFamily = null, notBycanvas = false, disableSpanReuse = false) => {
	if (supportCanvas && !notBycanvas) {
		return measureBycanvas(text, fontSize, fontFamily)
	} else {
		return measureBySpan(text, fontSize, fontFamily, disableSpanReuse)
	}
}

export default getTextWidth
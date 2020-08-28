/**
 * 深度克隆函数 deepClone
 * @param {*} obj 
 */
export const deepClone = (obj) => {
	var _toString = Object.prototype.toString

	// null, undefined, non-object, function
	if (!obj || typeof obj !== 'object') {
		return obj
	}

	// DOM Node
	if (obj.nodeType && 'cloneNode' in obj) {
		return obj.cloneNode(true)
	}

	// Date
	if (_toString.call(obj) === '[object Date]') {
		return new Date(obj.getTime())
	}

	// RegExp
	if (_toString.call(obj) === '[object RegExp]') {
		var flags = []
		if (obj.global) { flags.push('g') }
		if (obj.multiline) { flags.push('m') }
		if (obj.ignoreCase) { flags.push('i') }

		return new RegExp(obj.source, flags.join(''))
	}

	var result = Array.isArray(obj) ? [] :
		obj.constructor ? new obj.constructor() : {}

	for (var key in obj ) {
		result[key] = deepClone(obj[key])
	}

	return result
}

/**
 * @desc 函数防抖
 * @param fn 函数
 * @param t 延迟执行毫秒数
 * @param immediate true 表立即执行，false 非立即执行
 */
export const debounce = (fn, t = 500, immediate = false) => {
	let timer
	return function () {
		let args = arguments
		if (timer) clearTimeout(timer)
		if (immediate) {
			var callNow = !timer
			timer = setTimeout(() => {
				timer = null
			}, t)
			if (callNow) fn.apply(this, args)
		} else {
			timer = setTimeout(() => {
				fn.apply(this, args)
			}, t)
		}
	}
}

/**
 * @desc 函数节流
 * @param fn 函数
 * @param t 延迟执行毫秒数
 */
export const throttle = (fn, t = 500) => {
	let timer
	return function () {
		let args = arguments
		if (!timer) {
			timer = setTimeout(() => {
				timer = null
				fn.apply(this, args)
			}, t)
		}
	}
}

/**
 * @param timestamp 时间戳
 * @param format 格式 
 */
export const formatDate = (timestamp, format = 'yyyy-MM-dd hh:mm:ss') => {
	if (typeof timestamp === 'string') {
		return timestamp
	}
	if (!timestamp) return null
	let o = {
		'M+': timestamp.getMonth() + 1, // 月份
    'd+': timestamp.getDate(), // 日
    'h+': timestamp.getHours(), // 小时
    'm+': timestamp.getMinutes(), // 分
    's+': timestamp.getSeconds(), // 秒
    'q+': Math.floor((timestamp.getMonth() + 3) / 3), // 季度
    'S': timestamp.getMilliseconds() // 毫秒
	}
	if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (timestamp.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(format)) format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
  }
  return format
}

/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
	if (!name) return
	if (typeof content !== 'string') {
		content = JSON.stringify(content)
	}
	window.localStorage.setItem(name, content)
}

/**
 * 获取localStorage
 */
export const getStore = name => {
	if (!name) return
	let content = window.localStorage.getItem(name)
	return JSON.parse(content)
}

/**
 * 金额格式化
 * @param money 金额
 * @param digit 小数位数
 */
export const formatMoney = (money, digit = 2) => {
	let tpMoney
	if (money !== undefined && money !== '' && money !== null) {
		if (isNaN(money)) {
			tpMoney = ''
		} else {
			tpMoney = money
		}
	}
	tpMoney = Number(tpMoney)
	tpMoney = tpMoney.toFixed(digit) + ''
	let reg = /^(-?\d+)(\d{3})(\.?\d*)/
	while (reg.test(tpMoney)) {
		tpMoney = tpMoney.replace(reg, '$1,$2$3')
	}
	return tpMoney
}
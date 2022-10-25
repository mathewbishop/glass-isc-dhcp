var express = require('express')
var router = express.Router()
var fs = require('fs')
var template_render = require('../core/render-template.js')
var checkUserAuth = require('../core/checkUserAuth.js')

var checkUser = checkUserAuth()

router.get('/', checkUser, function (req, res, next) {
  dhcp_leases = template_render.get_template('dhcp_statistics_page')
  // dhcp_leases = template_render.set_template_variable(dhcp_leases, "table_data", table_data);

  res.send(template_render.get_index_template(dhcp_leases, req.url))
})

module.exports = router

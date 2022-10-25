var express = require('express')
var router = express.Router()
var fs = require('fs')
var template_render = require('../core/render-template.js')
var authorize = require('../core/authorize.js')
var checkUserAuth = require('../core/checkUserAuth.js')

var checkUser = checkUserAuth({ groupPermissionLevel: 'eng' })

router.get('/', checkUser, authorize.auth, function (req, res, next) {
  var content = ''

  content = template_render.get_template('dhcpv6_config')

  /* Read Config */
  var json_file = require('jsonfile')
  var glass_config = json_file.readFileSync('config/glass_config.json')

  content = template_render.set_template_variable(
    content,
    'title',
    'DHCPv6 Config'
  )
  content = template_render.set_template_variable(content, 'c_content', '')
  content = template_render.set_template_variable(
    content,
    'dhcpv6_config_location',
    glass_config.v6_config_file
  )

  var dhcpv6_config = fs.readFileSync(glass_config.v6_config_file, 'utf8')
  content = template_render.set_template_variable(
    content,
    'dhcpv6_config_content',
    dhcpv6_config
  )

  res.send(template_render.get_index_template(content, req.url))
})

module.exports = router
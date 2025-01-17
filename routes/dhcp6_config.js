var express = require('express')
var router = express.Router()
var fs = require('fs')
var template_render = require('../core/render-template.js')
var authGuard = require('../core/auth-guard.js')

var authCheck = authGuard({ groupPermissionLevel: 'admin' })

router.get('/', authCheck, function (req, res, next) {
  var content = ''

  content = template_render.get_template('dhcp6_config')

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
    'dhcp6_config_location',
    glass_config.v6_config_file
  )

  var dhcp6_config = fs.readFileSync(glass_config.v6_config_file, 'utf8')
  content = template_render.set_template_variable(
    content,
    'dhcp6_config_content',
    dhcp6_config
  )

  res.send(template_render.get_index_template(content, req.url))
})

module.exports = router

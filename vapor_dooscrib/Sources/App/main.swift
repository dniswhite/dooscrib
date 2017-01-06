import Vapor

let drop = Droplet()

var scribController = ScribController(drop: drop)

drop.run()

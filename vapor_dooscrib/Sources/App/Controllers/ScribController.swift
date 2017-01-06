import Vapor
import HTTP

final class ScribController {
    var dooscribs : [String: WebSocket]
    var droplet : Droplet

    init(drop: Droplet) {
        dooscribs = [:]
        droplet = drop

        droplet.get("", handler: scribRequest)
        droplet.get("about", handler: aboutRequest)
        droplet.socket("dooscrib", handler: socketHandler )
    }
    
    func aboutRequest(request: Request) throws -> ResponseRepresentable {
        return try droplet.view.make("about")
    }

    func scribRequest(request: Request) throws -> ResponseRepresentable {
        return try droplet.view.make("socket")
    }
    
    func socketHandler(request: Request, socket: WebSocket) throws {
        var scribUser: String? = nil
        
        // create an active ping to keep connection open
        try background {
            while socket.state == .open {
                try? socket.ping()
                drop.console.wait(seconds: 5)
            }
        }
        
        socket.onText = { socket, message in
            let json = try JSON(bytes: Array(message.utf8))
            
            guard let msgType = json.object?["command"]?.string, let user = json.object?["username"]?.string else {
                return
            }
            
            if msgType.equals(any: "connect") {
                scribUser = user
                self.dooscribs[user] = socket
                
                let response = try JSON(node: [
                    "command":"connected",
                    "username": user
                    ])
                
                // send a connect response to everyone including self
                for (_, connection) in self.dooscribs {
                    try connection.send(response)
                }
            } else if (msgType.equals(any: "clear")) {
                for (_, connection) in self.dooscribs {
                    try connection.send(json)
                }
            } else {
                // send message to everyone (minus self)
                for (scrib, connection) in self.dooscribs {
                    if (!scrib.equals(any: user)) {
                        try connection.send(json)
                    }
                }
            }
        }
        
        socket.onClose = { ws, _, _, _ in
            guard let user = scribUser else {
                return
            }
            
            let disconn = try JSON(node: [
                "command": "disconnect",
                "username": user
                ])
            
            // tell everyone (minus self) about disconnect
            for (remote, connection) in self.dooscribs {
                if (!remote.equals(any: user)) {
                    try connection.send(disconn)
                }
            }
            
            self.dooscribs.removeValue(forKey: user)
        }
    }
}

extension WebSocket {
    func send(_ json: JSON) throws {
        let data = try json.makeBytes()
        
        try send(data.string)
    }
}

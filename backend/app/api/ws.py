from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.emergency_state import emergency_manager

router = APIRouter(tags=["Real-time WebSockets"])

@router.websocket("/ws/emergency")
async def emergency_websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    emergency_manager.register_ws(websocket)
    await websocket.send_json(emergency_manager.get_current_state())
    try:
        while True:
            data = await websocket.receive_text()
            if data == "PING":
                await websocket.send_text("PONG")
    except WebSocketDisconnect:
        emergency_manager.unregister_ws(websocket)
    except Exception:
        emergency_manager.unregister_ws(websocket)

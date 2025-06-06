namespace userconfig {
    export const ARCADE_SCREEN_WIDTH = 320
    export const ARCADE_SCREEN_HEIGHT = 240
}

//global variables
let gridToggle: boolean = false
let cursor: Sprite = null

//game update

game.onUpdateInterval(500, function () {

})

//event handlers

//functions

//controller

controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (controller.player1.isPressed(ControllerButton.Left) && controller.player1.isPressed(ControllerButton.Right)) {
        if (game.ask("Toggle grid to " + !gridToggle + "?")) {
            gridToggle = !gridToggle

            if (gridToggle) {
                for (let value of tiles.getTilesByType(assets.tile`blank_gridfalse`)) {
                    tiles.setTileAt(value, assets.tile`blank_gridtrue`)
                }
            } else {
                for (let value of tiles.getTilesByType(assets.tile`blank_gridtrue`)) {
                    tiles.setTileAt(value, assets.tile`blank_gridfalse`)
                }
            }
        }
    } else {
        if (tiles.tileAtLocationEquals(cursor.tilemapLocation(), assets.tile`filled`)) {
            if (gridToggle) {
                tiles.setTileAt(cursor.tilemapLocation(), assets.tile`blank_gridtrue`)
            } else {
                tiles.setTileAt(cursor.tilemapLocation(), assets.tile`blank_gridfalse`)
            }
        } else {
            tiles.setTileAt(cursor.tilemapLocation(), assets.tile`filled`)
        }
    }
    //tiles.tileAtLocationEquals(cursor.tilemapLocation(), assets.tile`blank_gridtrue`) || tiles.tileAtLocationEquals(cursor.tilemapLocation(), assets.tile`blank_gridfalse`) *use if more tile types are added
})

controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (controller.player1.isPressed(ControllerButton.Left) && controller.player1.isPressed(ControllerButton.Right)) {
        if (game.ask("Trigger killswitch?")) {
            if (gridToggle) {
                for (let value of tiles.getTilesByType(assets.tile`filled`)) {
                    tiles.setTileAt(value, assets.tile`blank_gridtrue`)
                }
            } else {
                for (let value of tiles.getTilesByType(assets.tile`filled`)) {
                    tiles.setTileAt(value, assets.tile`blank_gridfalse`)
                }
            }
        }
    } else {
        
    }
})

//main
cursor = sprites.create(assets.image`cursor`, SpriteKind.Player)
tiles.setCurrentTilemap(tilemap`world`)

controller.moveSprite(cursor, 100, 100)

scene.cameraFollowSprite(cursor)
tiles.placeOnTile(cursor, tiles.getTileLocation(1, 1))
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
})

//main
cursor = sprites.create(assets.image`cursor`, SpriteKind.Player)
tiles.setCurrentTilemap(tilemap`world`)

controller.moveSprite(cursor, 100, 100)

scene.cameraFollowSprite(cursor)
tiles.placeOnTile(cursor, tiles.getTileLocation(1, 1))
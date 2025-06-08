namespace userconfig {
    export const ARCADE_SCREEN_WIDTH = 320
    export const ARCADE_SCREEN_HEIGHT = 240
}

//global variables
let gridToggle: boolean = false
let cursor: Sprite = null
let simToggle: boolean = false

let worldBoxMax: number = 16
let worldBoxXY: number = worldBoxMax
let worldSizeX: number = worldBoxMax
let worldSizeY: number = worldBoxMax

let liveSurroundingNum: number = null

//game update

game.onUpdateInterval(400, function () {
    if (simToggle) {
        for (let y = 0; y < worldSizeY; y++) {
            for (let x = 0; x < worldSizeX; x++) {
                liveSurroundingNum = 0

                if (tiles.tileAtLocationEquals(tiles.getTileLocation(x, y).getNeighboringLocation(CollisionDirection.Top), assets.tile`filled`)) {
                    liveSurroundingNum++
                }
                if (tiles.tileAtLocationEquals(tiles.getTileLocation(x, y).getNeighboringLocation(CollisionDirection.Right), assets.tile`filled`)) {
                    liveSurroundingNum++
                }
                if (tiles.tileAtLocationEquals(tiles.getTileLocation(x, y).getNeighboringLocation(CollisionDirection.Bottom), assets.tile`filled`)) {
                    liveSurroundingNum++
                }
                if (tiles.tileAtLocationEquals(tiles.getTileLocation(x, y).getNeighboringLocation(CollisionDirection.Left), assets.tile`filled`)) {
                    liveSurroundingNum++
                }

                if (tiles.tileAtLocationEquals(tiles.getTileLocation(x, y), assets.tile`filled`)) {
                    if (liveSurroundingNum < 2 || liveSurroundingNum > 3) {
                        if (gridToggle) {
                            tiles.setTileAt(tiles.getTileLocation(x, y), assets.tile`blank_gridtrue`)
                        } else {
                            tiles.setTileAt(tiles.getTileLocation(x, y), assets.tile`blank_gridfalse`)
                        }
                    }
                } else {
                    if (liveSurroundingNum == 3) {
                        tiles.setTileAt(tiles.getTileLocation(x, y), assets.tile`filled`)
                    }
                }
            }
        }
    }
})

//event handlers

//functions
function controllerSync(upOdown: boolean) {
    if (upOdown) {
        if (controller.player1.isPressed(ControllerButton.Down)) {
            upAndDown()
        }
    } else {
        if (controller.player1.isPressed(ControllerButton.Up)) {
            upAndDown()
        }
    }
}
function upAndDown() {
    if (game.ask("Change border size?", "This can always be undone.")) {
        worldBoxXY = 0
        while (worldBoxXY < 3 || worldBoxXY > 16) {
            worldBoxXY = game.askForNumber("Set world box size, 3 - 16", 2)
        }
        worldSizeX = worldBoxXY
        worldSizeY = worldBoxXY

        tiles.setCurrentTilemap(tilemap`world`)
        gridToggle = false
        tiles.placeOnTile(cursor, tiles.getTileLocation(1, 1))

        for (let y = worldBoxMax; y >= worldSizeY; y--) {
            for (let x = 0; x <= worldBoxMax; x++) {
                tiles.setWallAt(tiles.getTileLocation(x, y), true)
                tiles.setTileAt(tiles.getTileLocation(x, y), assets.tile`wall`)

            }
        }
        for (let x = worldBoxMax; x >= worldSizeY; x--) {
            for (let y = 0; y <= worldBoxMax; y++) {
                tiles.setWallAt(tiles.getTileLocation(x, y), true)
                tiles.setTileAt(tiles.getTileLocation(x, y), assets.tile`wall`)

            }
        }
    }
}

//controller
controller.A.onEvent(ControllerButtonEvent.Released, function () {
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
        if (game.ask("Toggle simulation to " + !simToggle + "?")) {
            simToggle = !simToggle
        }
    }
})

controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    controllerSync(true)
})
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    controllerSync(false)
})

//main
cursor = sprites.create(assets.image`cursor`, SpriteKind.Player)
tiles.setCurrentTilemap(tilemap`world`)

controller.moveSprite(cursor, 100, 100)

scene.cameraFollowSprite(cursor)
tiles.placeOnTile(cursor, tiles.getTileLocation(1, 1))
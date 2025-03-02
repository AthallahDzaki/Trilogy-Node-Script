import express from "express";
import cors from "cors";

export class APIHandler {
    constructor(effectDataBase, wsServer) {
        this.app = express();
        this.port = 8832;

        this.effectDataBase = effectDataBase;
        this.wsServer = wsServer;

        this.app.use(
            cors({
                origin: "*",
                methods: "*",
                allowedHeaders: "*",
                exposedHeaders: "*",
            })
        );

        this.UnsupportedEffectCategory = ["RapidFire"];

        this.app.use("/api", this.handleAPIRoutes());

        this.app.use((err, req, res, next) => {
            console.log("Internal Error: ", err);
            res.json({ message: "API: " + err.message });
        });

        this.app.get("/", (req, res) => {
            res.send("So.... you're looking for something?");
        });

        this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }

    handleAPIRoutes() {
        let router = express.Router();

        router.get("/", (req, res) => {
            res.send("API is running!");
        });

        router.get("/app/info", (req, res) => {
            res.json({
                data: {
                    author: "@athallahdzaki",
                    name: "GTA-SA Chaos",
                    version: "1.0.0",
                },
            });
        });

        router.use("/features", this.handleFeatureRoutes());

        return router;
    }

    handleFeatureRoutes() {
        let router = express.Router();

        router.get("/categories", (req, res) => {
            let effects = JSON.parse(this.effectDataBase)["Function"];
            let categories = [];
            // Example : {
            //     categoryId: effect.category,
            //     categoryName: effect.category,
            // }

            effects.forEach((effect) => {
                if (
                    categories.find((x) => x.categoryId == effect.category) ==
                        undefined &&
                    !this.UnsupportedEffectCategory.includes(effect.category)
                ) {
                    categories.push({
                        categoryId: effect.category,
                        categoryName: effect.category,
                    });
                }
            });
            res.json({ data: categories });
        });

        router.get("/actions", (req, res) => {
            if (req.query.categoryId == undefined) {
                res.status(400).json({
                    message: "[API] Category is not defined!",
                });
                return;
            }
            if (req.query.categoryId == "") {
                res.status(400).json({ message: "[API] Category is empty!" });
                return;
            }
            let effects = JSON.parse(this.effectDataBase)["Function"];
            let actions = [];

            effects.forEach((effect) => {
                if (
                    effect.category.toLowerCase() ==
                    req.query.categoryId.toLowerCase()
                ) {
                    // Skip Exclusive Effect
                    actions.push({
                        actionId: effect.id,
                        actionName: effect.name,
                    });
                }
            });

            res.json({ data: actions });
        });

        router.post(
            "/actions/exec",
            express.json({ type: "*/*" }),
            (req, res) => {
                /*
            {
                "categoryId":"smart_device_control",
                "actionId":"turn_lights_on",
                "context":{
                    "triggerTypeId": 3,
                    "userId": "123456789",
                    "username": "Tesuser",
                    "coins": 12
                }
            }
            */
                if (
                    req.body.categoryId == undefined ||
                    req.body.actionId == undefined
                ) {
                    res.status(400).json({
                        message: "[API] Category or Action is not defined!",
                    });
                    return;
                }

                if (req.body.categoryId == "" || req.body.actionId == "") {
                    res.status(400).json({
                        message: "[API] Category or Action is empty!",
                    });
                    return;
                }

                console.log("[API] Executing Action: ", req.body);

                let effects = JSON.parse(this.effectDataBase)["Function"];
                console.log("ED : ", this.effectDataBase);
                console.log("Parsing : ", effects);
                let effect = effects.find(
                    (x) =>
                        x.id.toLowerCase() == 
                            req.body.actionId.toLowerCase() &&
                        x.category.toLowerCase() ==
                            req.body.categoryId.toLowerCase()
                );
                if (effect == undefined) {
                    res.status(404).json({
                        message: "[API] Action not found!",
                    });
                    return;
                }

                console.log("[API] Effect Found: ", effect);

                res.json({ data: [] });
            }
        );

        router.get("/", (req, res) => {
            res.send("Feature API is running!");
        });

        return router;
    }
}

export class API extends APIHandler {
    constructor(effectDataBase, wsServer, userSeed, rngInstance) {
        super(effectDataBase, wsServer, userSeed, rngInstance);
    }
}

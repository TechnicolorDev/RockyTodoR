const { Color } = require('./EditColorFromDb');

const defaultColors = {
    "primary-color": '#0061fc',
    "secondary-color": '#ffffff',
    "secondary-color-bg": '#1a1a1a',
    "background-color": '#0c0c0c',
    "input-bg-color": '#313131',
    "button-hover-color": '#0051d4',
    "invisible-text": 'rgba(138, 138, 138, 0.78)',
    "gradient-bg": 'linear-gradient(to bottom, rgb(35, 35, 35) 25%, rgb(17, 17, 17) 100%)',
};

const getColors = async (req, res) => {
    try{

        const colors = await Color.findAll();
        const colorMap = colors.length
            ? colors.reduce((acc, color) => ({ ...acc, [color.name]: color.value }), {})
            : defaultColors;
        res.json(colorMap);

    } catch (error){
        console.error("Error fetching colors:", error)
        res.star(500).json({message: "Error fetching colors."});
    }
};

const updateColor = async (req, res) => {
    const { name, value } = req.body;

    if (!name || !value) {
        return res.status(400).json({ message: "Both name and value are required!" });
    }

    try {
        const color = await Color.findOne({ where: { name } });

        if (color) {
            await color.update({ value });
            const updatedColors = await Color.findAll();
            const colorMap = updatedColors.reduce((acc, color) => ({ ...acc, [color.name]: color.value }), {});
            return res.json(colorMap);
        } else {
            await Color.create({ name, value });
            const updatedColors = await Color.findAll();
            const colorMap = updatedColors.reduce((acc, color) => ({ ...acc, [color.name]: color.value }), {});
            return res.json(colorMap);
        }

    } catch (error) {
        console.error(`Error while updating the color (${name})`, error);
        res.status(500).json({ message: "Error updating color." });
    }
};

const resetColors = async (req, res) => {
    try {

        await Color.destroy({where: {}});

        await Promise.all(
            Object.entries(defaultColors).map(([name, value]) =>
                Color.create({ name, value})
            )
        );

        res.json({ message: 'Colors reset to default successfully.' });

    } catch (error) {
        console.error("Error resetting colors:", error);
        res.status(500).json({message: "Error resetting colors"});
    }
};

module.exports = {
    getColors,
    updateColor,
    resetColors,
    defaultColors,
}

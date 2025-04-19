class Controller {
  static home(req, res) {
    res.status(200).json({ Home: `Vercel Config Changed` });
  }

  static check(req, res) {
    res.status(200).json({ Home: `Check v2 version` });
  }
}

module.exports = Controller;

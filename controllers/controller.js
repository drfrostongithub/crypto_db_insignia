class Controller {
  static home(req, res) {
    res.status(200).json({ Home: `This is homepage` });
  }
}

module.exports = Controller;

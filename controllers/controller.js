class Controller {
  static home(req, res) {
    res.status(200).json({ Home: `I guess you wonder where I went ?` });
  }
}

module.exports = Controller;

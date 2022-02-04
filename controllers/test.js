exports.update = async (req, res) => {

    // if (req.method == 'POST') {
    //     var post = req.body;
    //     var first_name = post.first_name;
    //     var last_name = post.last_name;


    try {
        await upload(req, res);
      

        if (req.files.length <= 0) {
            return res.send(`You must select at least 1 file.`);
        }

        return res.send(`Files has been uploaded.`);
    } catch (error) {
        console.log(error);

        if (error.code === "LIMIT_UNEXPECTED_FILE") {
            return res.send("Too many files to upload.");
        }
        return res.send(`Error when trying upload many files: ${error}`);
    }

}

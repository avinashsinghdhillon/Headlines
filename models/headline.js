var mongoose = require ("mongoose");
var Schema = mongoose.Schema;

var HeadlineSchema = new Schema({
    title: {
        type: String,
        unique: true
    },
    url: String,
    time: String
    // notes: [
    //     {
    //         type: Schema.Types.ObjectId,
    //         ref: "Note"
    //     }
    // ]
});

var Headline = mongoose.model("Headline", HeadlineSchema);
module.exports = Headline;
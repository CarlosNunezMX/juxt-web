const { Schema, model } = require('mongoose');

const PostSchema = new Schema({
    id: String,
    title_id: String,
    screen_name: String,
    body: String,
    app_data: String,
    painting: String,
    screenshot: String,
    search_key: {
        type: [String],
        default: undefined
    },
    topic_tag: {
        type: [String],
        default: undefined
    },
    community_id: {
        type: String,
        default: undefined
    },
    created_at: Date,
    feeling_id: Number,
    is_autopost: {
        type: Number,
        default: 0
    },
    is_community_private_autopost: {
        type: Number,
        default: 0
    },
    is_spoiler: {
        type: Number,
        default: 0
    },
    is_app_jumpable: {
        type: Number,
        default: 0
    },
    empathy_count: {
        type: Number,
        default: 0
    },
    language_id: {
        type: Number,
        default: 1
    },
    mii: String,
    mii_face_url: String,
    pid: Number,
    platform_id: Number,
    region_id: Number,
    parent_post: String,
    reply_count: {
        type: Number,
        default: 0
    },
    verified: {
        type: Boolean,
        default: false
    },
    message_to_pid: {
        type: String,
        default: null
    }
});


PostSchema.methods.upEmpathy = async function() {
    const empathy = this.get('empathy_count');
    this.set('empathy_count', empathy + 1);

    await this.save();
};

PostSchema.methods.downEmpathy = async function() {
    const empathy = this.get('empathy_count');
    this.set('empathy_count', empathy - 1);

    await this.save();
};

PostSchema.methods.upReply = async function() {
    const replyCount = this.get('reply_count');
    this.set('reply_count', replyCount + 1);

    await this.save();
};

PostSchema.methods.downReply = async function() {
    const replyCount = this.get('reply_count');
    this.set('reply_count', replyCount - 1);

    await this.save();
};

const POST = model('POST', PostSchema);

module.exports = {
    PostSchema,
    POST
};

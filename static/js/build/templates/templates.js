// This file was automatically generated from templates.soy.
// Please don't edit this file by hand.

goog.provide('commentum.templates');

goog.require('soy');
goog.require('soy.StringBuilder');


commentum.templates.Page = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div class="page_info" id="', soy.$$escapeHtml(opt_data.page.panelId), '"><div class="page_control"><div class="page_control_toggle page_content_toggle" id="', soy.$$escapeHtml(opt_data.page.commentsShowId), '">*</div><div class="page_control_toggle page_blocks_toggle">b</div><div class="clear"></div></div><div class="page_content" id="', soy.$$escapeHtml(opt_data.page.commentsId), '"></div></div>');
  return opt_sb ? '' : output.toString();
};


commentum.templates.Block = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<span class="block_info" id="', soy.$$escapeHtml(opt_data.block.id), '">', soy.$$escapeHtml(opt_data.block.content), '</span><span class="block_info_hint" id="', soy.$$escapeHtml(opt_data.block.hintSpanId), '"> <span class="block_info_hint_content" id="', soy.$$escapeHtml(opt_data.block.hintId), '">');
  commentum.templates.BlockCommentCount(opt_data, output);
  output.append('</span></span>');
  return opt_sb ? '' : output.toString();
};


commentum.templates.BlockCommentCount = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<span id="', soy.$$escapeHtml(opt_data.block.commentCountId), '">', (opt_data.block.commentCount) ? soy.$$escapeHtml(opt_data.block.commentCount) : soy.$$escapeHtml(opt_data.strings.block_add), '</span>');
  return opt_sb ? '' : output.toString();
};


commentum.templates.PageComments = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div class="page_comments" id="', soy.$$escapeHtml(opt_data.page_comments.id), '"><div class="page_comments_info" id="', soy.$$escapeHtml(opt_data.page_comments.commentsId), '"></div><div class="page_comments_post comment_post" id="', soy.$$escapeHtml(opt_data.page_comments.commentsPostId), '"></div></div>');
  return opt_sb ? '' : output.toString();
};


commentum.templates.PageCommentsSearch = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div class="page_comments_search" id="', soy.$$escapeHtml(opt_data.page_comments_search.id), '"><input type="text" size="40" name="" id="', soy.$$escapeHtml(opt_data.page_comments_search.textId), '" /><div class="page_comments_search_button">s</div></div>');
  return opt_sb ? '' : output.toString();
};


commentum.templates.BlockComments = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<span style="position: relative" id="', soy.$$escapeHtml(opt_data.block_comments.id), '"><div style="position: absolute; left: 0px; bottom: 0px"><div style="position: absolute; left: 0px; top: 0px"><div class="block_comments"><div class="block_comments_info" id="', soy.$$escapeHtml(opt_data.block_comments.commentsId), '"></div><div class="block_comments_post comment_post" id="', soy.$$escapeHtml(opt_data.block_comments.commentsPostId), '"></div></div></div></div></span>');
  return opt_sb ? '' : output.toString();
};


commentum.templates.Comment = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div class="comment_info" id="', soy.$$escapeHtml(opt_data.comment.id), '"><div class="comment_width"><div class="comment_info_meta"><div class="comment_info_photo"></div><div class="comment_info_author">', soy.$$escapeHtml(opt_data.comment.author.username), '</div></div><div class="comment_info_content"><div class="comment_info_date">', soy.$$escapeHtml(opt_data.comment.date), '</div><div class="comment_info_text">', soy.$$escapeHtml(opt_data.comment.text), '</div></div><div class="clear"></div></div></div>');
  return opt_sb ? '' : output.toString();
};


commentum.templates.CommentPost = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div id="', soy.$$escapeHtml(opt_data.comment_post.id), '"><form class="comment_post_form comment_width"><div><textarea id="', soy.$$escapeHtml(opt_data.comment_post.textId), '" class="comment_post_text"></textarea></div><div><input id="', soy.$$escapeHtml(opt_data.comment_post.submitId), '" class="comment_post_submit" type="button" value="', soy.$$escapeHtml(opt_data.strings.comment_post_submit), '" /></div><div class="clear"></div></form></div>');
  return opt_sb ? '' : output.toString();
};


commentum.templates.CommentPostAuth = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div id="', soy.$$escapeHtml(opt_data.comment_post.id), '"><form class="comment_post_login_form comment_width"><div class="comment_post_login"><label class="comment_post_login" for="', soy.$$escapeHtml(opt_data.comment_post.loginId), '">', soy.$$escapeHtml(opt_data.strings.comment_post_login), '</label>&nbsp;<input type="text" class="comment_post_login" id="', soy.$$escapeHtml(opt_data.comment_post.loginId), '" /><div class="clear"></div></div><div class="comment_post_password"><label class="comment_post_password" for="', soy.$$escapeHtml(opt_data.comment_post.passwordId), '">', soy.$$escapeHtml(opt_data.strings.comment_post_password), '</label>&nbsp;<input type="password" class="comment_post_password" id="', soy.$$escapeHtml(opt_data.comment_post.passwordId), '" /><div class="clear"></div></div><div class="comment_post_login_submit"><input id="', soy.$$escapeHtml(opt_data.comment_post.signInId), '" class="comment_post_login_signin" type="button" value="', soy.$$escapeHtml(opt_data.strings.comment_post_login_signin), '" /><input id="', soy.$$escapeHtml(opt_data.comment_post.signUpId), '" class="comment_post_login_signup" type="button" value="', soy.$$escapeHtml(opt_data.strings.comment_post_login_signup), '" /><div class="clear"></div></div><div class="line"></div><div class="comment_post_login_other"><label class="comment_post_login_other">', soy.$$escapeHtml(opt_data.strings.comment_post_login_other), '</label>');
  var login_serviceList102 = opt_data.comment_post.loginServices;
  var login_serviceListLen102 = login_serviceList102.length;
  for (var login_serviceIndex102 = 0; login_serviceIndex102 < login_serviceListLen102; login_serviceIndex102++) {
    var login_serviceData102 = login_serviceList102[login_serviceIndex102];
    output.append('<span id="', soy.$$escapeHtml(opt_data.comment_post.loginServiceId), soy.$$escapeHtml(login_serviceData102), '" class="icon" style="cursor: pointer; margin-right: 12px; background-image: url(\'/static/images/icon-', soy.$$escapeHtml(login_serviceData102), '.png\')"></span>');
  }
  output.append('</div></form></div>');
  return opt_sb ? '' : output.toString();
};


commentum.templates.CommentPostFrame = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div id="', soy.$$escapeHtml(opt_data.comment_post.id), '"><div id="', soy.$$escapeHtml(opt_data.comment_post.splashId), '" class="comment_post_frame_splash comment_width">Loading...</div></div>');
  return opt_sb ? '' : output.toString();
};


commentum.templates.BlockMarker = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<span class="block_info_hint block_info_hint_selected" id="', soy.$$escapeHtml(opt_data.block_marker.id), '"> <span class="block_info_hint_content" id="', soy.$$escapeHtml(opt_data.block_marker.hintId), '">', soy.$$escapeHtml(opt_data.strings.block_add), '</span></span>');
  return opt_sb ? '' : output.toString();
};


commentum.templates.FramePageComments = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div class="comment_post comment_post_inframe" id=', soy.$$escapeHtml(opt_data.page_comments.id), '><div id=', soy.$$escapeHtml(opt_data.page_comments.commentsPostId), '></div></div>');
  return opt_sb ? '' : output.toString();
};


commentum.templates.FrameBlockComments = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div class="comment_post comment_post_inframe" id=', soy.$$escapeHtml(opt_data.block_comments.id), '><div id=', soy.$$escapeHtml(opt_data.block_comments.commentsPostId), '></div></div>');
  return opt_sb ? '' : output.toString();
};

package com.jisang.bangtong.repository.chat;

import com.jisang.bangtong.model.chat.Chat;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.ConnectionCallback;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class ChatJdbcRepositoryImpl implements ChatJdbcRepository{

  @Autowired
  private JdbcTemplate jdbcTemplate;

  public void saveAllListChats(List<Chat> messages) {
    String getNextIdSql = "SELECT NEXTVAL(chat_id_seq)";
    String insertSql = "INSERT INTO chat (`chat_id`, `chat_content`, `chat_time`, `chatroom_id`, `sender_id`) VALUES (?, ?, ?, ?, ?)";

    for (Chat chat : messages) {
      Long nextId = jdbcTemplate.queryForObject(getNextIdSql, Long.class);
      chat.setChatId(nextId);
    }

    jdbcTemplate.batchUpdate(insertSql, new BatchPreparedStatementSetter() {
      @Override
      public void setValues(PreparedStatement ps, int i) throws SQLException {
        Chat chat = messages.get(i);
        ps.setLong(1, chat.getChatId());
        ps.setString(2, chat.getChatContent());
        ps.setTimestamp(3, new Timestamp(chat.getChatTime().getTime()));
        ps.setLong(4, chat.getChatRoom().getChatroomId());
        ps.setLong(5, chat.getSender().getUserId());
      }

      @Override
      public int getBatchSize() {
        return messages.size();
      }
    });
  }



}

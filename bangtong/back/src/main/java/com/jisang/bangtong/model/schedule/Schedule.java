package com.jisang.bangtong.model.schedule;

import com.jisang.bangtong.model.chatroom.Chatroom;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long scheduleId;

    //    TODO: 채팅방 ID
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "chatroom_id")
    private Chatroom chatroom;

    @Column(nullable = false)
    private Date scheduleDate;

    @Temporal(value = TemporalType.TIMESTAMP)
    @CreationTimestamp
    @Column(nullable = false)
    private Date scheduleCreatedAt;


}

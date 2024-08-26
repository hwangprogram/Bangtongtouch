package com.jisang.bangtong.repository.preference;

import com.jisang.bangtong.model.preference.Preference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PreferenceRepository extends JpaRepository<Preference, Long> {

  Preference findByPreferenceId(long preferenceId);

  Preference findFirstByUser_UserId(long userId);

  List<Preference> findAllByUser_UserId(long userId);
}
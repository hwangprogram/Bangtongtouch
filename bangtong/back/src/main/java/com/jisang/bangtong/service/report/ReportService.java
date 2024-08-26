package com.jisang.bangtong.service.report;

import com.jisang.bangtong.dto.report.ReportDto;
import com.jisang.bangtong.model.board.Board;
import com.jisang.bangtong.model.product.Product;
import com.jisang.bangtong.model.report.Report;
import com.jisang.bangtong.model.user.User;
import com.jisang.bangtong.repository.board.BoardRepository;
import com.jisang.bangtong.repository.product.ProductRepository;
import com.jisang.bangtong.repository.report.ReportRepository;
import com.jisang.bangtong.repository.report.ReportTypeRepository;
import com.jisang.bangtong.repository.user.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
public class ReportService {

  private final String SUCCESS = "success";
  private final String CLIENT_ERROR = "client_error";
  private final String SERVER_ERROR = "server_error";
  private final int maxCount = 3;  //신고 최대 카운트


  private ReportRepository reportRepository;
  private ReportTypeRepository reportTypeRepository;
  private UserRepository userRepository;
  private BoardRepository boardRepository;
  private ProductRepository productRepository;

  private final String BANNED = "신고 누저으로 인해 이용에 제한이 생겼습니다.";

  // 신고 전송
  @Transactional
  public Report manageReport(ReportDto reportDto) {
    Report report = new Report();
    int reportTypeId = reportDto.getReportTypeId();
    report.setReportType(reportTypeRepository.findById(reportTypeId).orElse(null));
    report.setReportContent(reportDto.getContent());

    int reportSubjectTypeId = reportDto.getReportSubjectTypeId();
    Long subjectId = reportDto.getSubjectId();
    User reportedUser = null;

//        report switch
    switch (reportSubjectTypeId) {
      case 0:
        Board board = boardRepository.findById(reportDto.getSubjectId()).orElse(null);

        if (board == null) {
          report = null;
        } else {
          report.setBoard(board);
          reportedUser = board.getBoardWriter();
        }

        break;
      case 1:
        Product product = productRepository.findById(subjectId).orElse(null);

        if (product == null) {
          report = null;
        } else {
          report.setProduct(product);
          reportedUser = product.getUser();
        }

        break;
      case 2:
        reportedUser = userRepository.findById(reportDto.getSubjectId()).orElse(null);

        if (reportedUser == null) {
          report = null;
        } else {
          report.setUser(reportedUser);
        }

        break;

      default:
        return null;
    }

    if (report != null) {
      reportRepository.save(report);

      if (reportedUser != null) {
        int reportCountUser = reportRepository.countByUser_UserId(reportedUser.getUserId());

        if (reportCountUser >= maxCount) {
          reportedUser.setUserIsBanned(true);
          userRepository.save(reportedUser);
//                    return BANNED;
        }

      }

      if (report.getBoard() != null) {
        int reportCountBoard = reportRepository.countByBoard_BoardId(
            report.getBoard().getBoardId());
        if (reportCountBoard >= maxCount) {
          report.getBoard().setBoardIsBanned(true);
          boardRepository.save(report.getBoard());
        }
      }

      if (report.getProduct() != null) {
        int reportCountProduct = reportRepository.countByProduct_ProductId(
            report.getProduct().getProductId());
        if (reportCountProduct >= maxCount) {
          report.getProduct().setProductIsBanned(true);
          productRepository.save(report.getProduct());
        }
      }
    }

    return report;
  }
}
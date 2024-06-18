package sk.stuba.fei.bc.TaxiService.admin.web.bodies;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import sk.stuba.fei.bc.TaxiService.candidate.Candidate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CandidateResponse {
    private Long id;
    private String fname;
    private String lname;
    private String email;
    private String telephone;

    public CandidateResponse(Candidate candidate) {
        this.id=candidate.getId();
        this.fname=candidate.getFname();
        this.lname=candidate.getLname();
        this.email=candidate.getEmail();
        this.telephone=candidate.getPhoneNumber();
    }
}

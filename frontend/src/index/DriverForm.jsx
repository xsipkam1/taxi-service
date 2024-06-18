import { useFormik } from 'formik';
import * as yup from 'yup';
import {useState} from 'react';
import axios from "../security/CrossOrigin";
import ResponseModal from '../common/ResponseModal';

export default function DriverForm({ handleExitClick }) {

  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [responseModalShow, setResponseModalShow] = useState(false);

  const validationSchema = yup.object().shape({
    email: yup.string().email('Neplatný email').required('Povinné'),
    fname: yup
      .string()
      .matches(/^[A-ZČŠĎŤŽÝÁÍÉÚÄÔÖĽľčšťžýáíéúäôö]+[a-zčšťžýáíéúäôöĽľČŠĎŤŽÝÁÍÉÚÄÔÖĽľčšťžýáíéúäôöĽľ]*$/, 'Neplatné meno')
      .min(2, 'Aspoň 2 znaky')
      .max(30, 'Najviac 30 znakov')
      .required('Povinné'),
    lname: yup
      .string()
      .matches(/^[A-ZČŠĎŤŽÝÁÍÉÚÄÔÖĽľčšťžýáíéúäôö]+[a-zčšťžýáíéúäôöĽľČŠĎŤŽÝÁÍÉÚÄÔÖĽľčšťžýáíéúäôöĽľ]*$/, 'Neplatné priezvisko')
      .min(2, 'Aspoň 2 znaky')
      .max(30, 'Najviac 30 znakov')
      .required('Povinné'),
    phoneNumber: yup
      .string()
      .matches(/^[0-9]{10}$/, 'Neplatné tel.č.')
      .required('Povinné'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      fname: '',
      lname: '',
      phoneNumber: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      if (await createDriverRequest(values)) {
        resetForm();
        setTitle("ÚSPEŠNE STE PODALI ŽIADOSŤ");
        setMessage("Vašu žiadosť sme obdržali. Priebežne si kontrolujte email, ktorý ste zadali - sem Vám pošleme rozhodnutie a prípadne ďalšie pokyny.");
        setResponseModalShow(true);
      }
    },
  });

  const createDriverRequest = async (values) => {
    try {
      const response = await axios.post("/auth/driver-request", values);
      return response?.status === 200 ? true : false;
    } catch (err) {
      if (!err?.response) {
        setTitle("CHYBA");
        setMessage("Server momentálne neodpovedá, skúste to prosím neskôr.");
      } else {
        setTitle("CHYBA");
        setMessage("Podanie žiadosti zlyhalo.");
      }
      setResponseModalShow(true);
      return false;
    }
  };

  return (
    <>
      <div className="container py-5 mt-5 overflow-hidden">
        <div className="row d-flex justify-content-center align-items-center">
          <div className="col-xl-11">
            <div className="card">
              <div className="row g-0">
                <div className="col-lg-6 order-lg-1 order-2">

                  <div className="card-body p-md-5 mx-md-4">
                    <a href="#" className="exit" onClick={handleExitClick}>X</a>
                    <p className="text-black-70 mb-5 text-center">Zadajte prosím svoje údaje.</p>
                    <form className="text-center" onSubmit={formik.handleSubmit}>
                      <div className="form-outline form-white mb-4">
                        <input
                          type="text"
                          className={`form-control form-control-lg ${formik.touched.email && formik.errors.email ? 'is-invalid' : formik.touched.email ? 'is-valid' : ''}`}
                          placeholder="email"
                          name="email"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          value={formik.values.email}
                        />
                        {formik.touched.email && formik.errors.email && (
                          <div className="invalid-feedback text-start position-absolute mt-0">{formik.errors.email}</div>
                        )}
                      </div>

                      <div className="form-outline form-white mb-4">
                        <input
                          type="text"
                          className={`form-control form-control-lg ${formik.touched.fname && formik.errors.fname ? 'is-invalid' : formik.touched.fname ? 'is-valid' : ''}`}
                          placeholder="meno"
                          name="fname"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          value={formik.values.fname}
                        />
                        {formik.touched.fname && formik.errors.fname && (
                          <div className="invalid-feedback text-start position-absolute mt-0">{formik.errors.fname}</div>
                        )}
                      </div>

                      <div className="form-outline form-white mb-4">
                        <input
                          type="text"
                          className={`form-control form-control-lg ${formik.touched.lname && formik.errors.lname ? 'is-invalid' : formik.touched.lname ? 'is-valid' : ''}`}
                          placeholder="priezvisko"
                          name="lname"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          value={formik.values.lname}
                        />
                        {formik.touched.lname && formik.errors.lname && (
                          <div className="invalid-feedback text-start position-absolute mt-0">{formik.errors.lname}</div>
                        )}
                      </div>

                      <div className="form-outline form-white mb-4">
                        <input
                          type="text"
                          className={`form-control form-control-lg ${formik.touched.phoneNumber && formik.errors.phoneNumber ? 'is-invalid' : formik.touched.phoneNumber ? 'is-valid' : ''}`}
                          placeholder="telefónne číslo"
                          name="phoneNumber"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          value={formik.values.phoneNumber}
                        />
                        {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                          <div className="invalid-feedback text-start position-absolute mt-0">{formik.errors.phoneNumber}</div>
                        )}
                      </div>

                      <button className="btn btn-primary btn-lg px-5 form-button rounded-pill" type="submit">ODOSLAŤ</button>
                    </form>
                  </div>
                </div>

                <div className="col-lg-6 d-flex align-items-center driver">
                  <div className="text-white px-3 py-4 p-md-5 mx-md-4">
                    <h2 className="mb-4 fs-1">Chceš sa stať vodičom?</h2>
                    <p className="mb-0">
                      Je to jednoduché. Stačí vyplniť formulár a my ti zašleme rozhodnutie na email.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      <ResponseModal
        show={responseModalShow}
        handleClose={() => { setResponseModalShow(false); }}
        title={title}
        message={message}
      />
    </>
  );
}

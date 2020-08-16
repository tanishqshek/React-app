import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle, Breadcrumb, BreadcrumbItem, Button, Label,
    Modal, ModalBody, ModalHeader, Col, Row } from 'reactstrap';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Loading } from './LoadingComponent';
import { Link } from 'react-router-dom';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';



const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => (val) && (val.length >= len);

    class CommentForm extends Component {

        constructor(props){
            super(props);
            this.state = {
                isModalOpen:false,
            }

            this.toggleModal = this.toggleModal.bind(this);
            this.handleSubmit = this.handleSubmit.bind(this);
        }

        toggleModal(){
            this.setState({
                isModalOpen: !this.state.isModalOpen
            });
        }

        handleSubmit(values){
            // alert("Current State is: " + JSON.stringify(values));
            this.props.postComment(this.props.dishId, values.rating, values.author, values.comment);
        }

        render(){
            return(
            <div>
                <Button outline onClick={this.toggleModal}>
                    <span className="fa fa-pencil"> Submit Comment</span>
                </Button>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                <ModalBody>
                <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                    <Row className="form-group">
                        <Label htmlFor="rating" md={12}>Rating</Label>
                        <Col md={{ size:12 }}>
                            <Control.select model=".rating" name="rating"
                            className="form-control">
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </Control.select>
                        </Col>
                    </Row>

                    <Row className="form-group">
                        <Label htmlFor="author" md={12}>Your Name</Label>
                        <Col md={{ size:12 }}>
                            <Control.text model=".author" name="author" className="form-control" 
                            placeholder="Your Name"
                            validators={{
                                required, minLength: minLength(3), maxLength: maxLength(15)
                            }}/>
                            <Errors
                            className="text-danger"
                            model=".author"
                            show="touched"
                            messages={{
                                required: 'Required',
                                minLength: 'Must be greater than 2 characters',
                                maxLength:'Must be 15 characters or less'
                            }}
                            />
                        </Col>
                    </Row>
                    <Row className="form-group">
                    <Label htmlFor="comment" md={12}>Comment</Label>
                        <Col md={{ size:12 }}>
                            <Control.textarea  model=".comment" name="comment" className="form-control" 
                            rows="6"/>
                        </Col>
                    </Row>
                    <Button type="submit" value="submit" color="primary">Submit</Button>
                </LocalForm>
                </ModalBody>
            </Modal>
            </div>
            )}
    }

    function RenderDish({dish}){
        return(
            <div className="col-12 col-md-5 m-1">
                <FadeTransform
                in
                transformProps={{
                    exitTransform: 'scale(0.5) translateY(-50%)'
                }}>
            <Card>
                <CardImg width="100%" src={baseUrl + dish.image} alt={dish.name}></CardImg>
                <CardBody>
                    <CardTitle>{dish.name}</CardTitle>
                    <CardText>{dish.description}</CardText>
                </CardBody>
            </Card>
            </FadeTransform>
            </div>
        )
    }

    function RenderComments({comments, postComment, dishId}) {
        if (comments != null) {
            return(
                <div className="col-12 col-md-5 m-1">
                    <h4>Comments</h4>
                    <ul className="list-unstyled">
                    <Stagger in>
                        {comments.map((comment) => {
                            return (
                                <Fade in>
                                <li key={comment.id}>
                                <p>{comment.comment}</p>
                                <p>-- {comment.author} , {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}</p>
                                </li>
                                </Fade>
                            );
                        })}
                        </Stagger>
                    </ul>
                    <CommentForm dishId={dishId} postComment={postComment}/>
                </div>
            );
            
        }
        else {
            return(
                <div></div>
            );
        }
    };
    
        

    const DishDetail =(props)=> {
        console.log('Dishdetail Render Invoked');
        
        if(props.isLoading){
            return(
                <div className="container">
                    <div className="row">
                        <Loading />
                    </div>
                </div>
            );
        }
        else if (props.errMess){
            return(
                <div className="container">
                    <div className="row">
                        <h4>{props.errMess}</h4>
                    </div>
                </div>
            );
        }
        else if(props.dish){
            return(
                <div className="container">
                    <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                        <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>{props.dish.name}</h3>
                        <hr />
                    </div>
                </div>
                <div className="row">
                        <RenderDish dish={props.dish} />
                        <RenderComments comments={props.comments}
                            postComment={props.postComment}
                            dishId={props.dish.id} />
                </div>
                </div>
            )
        }
        else{
            return(
                <div></div>
            )
        }
    }


export default DishDetail;